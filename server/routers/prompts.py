from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from typing import List, Optional
import os
from config.llm import llm
from supabase import create_client, Client
from dotenv import load_dotenv
import logging

load_dotenv()

router = APIRouter()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Supabase client
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(supabase_url, supabase_key)

# Default prompts for new users
DEFAULT_PROMPTS = [
    {
        "title": "Write a to-do list for a personal project or task",
        "category": "Personal"
    },
    {
        "title": "Generate an email to reply to a job offer",
        "category": "Professional"
    },
    {
        "title": "Summarise this article or text for me in one paragraph",
        "category": "Summary"
    },
    {
        "title": "How does AI work in a technical capacity",
        "category": "Technical"
    }
]

@router.get("/prompts/{user_id}")
async def get_user_prompts(user_id: str):
    """
    Get personalized prompts for a user based on their chat history.
    If no chat history exists, returns default prompts.
    """
    try:
        # Fetch user's chat sessions from Supabase
        chat_response = supabase.table("chat_sessions").select("*").eq("user_id", user_id).execute()

        if not chat_response.data or len(chat_response.data) == 0:
            logger.info(f"No chat history found for user {user_id}, returning default prompts")
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "status": "success",
                    "prompts": DEFAULT_PROMPTS,
                    "is_personalized": False,
                    "message": "Default prompts returned"
                }
            )

        # Fetch messages from only the most recent 1-2 chat sessions
        recent_sessions = sorted(chat_response.data, key=lambda x: x["created_at"], reverse=True)[:2]
        session_ids = [session["id"] for session in recent_sessions]
        messages_response = supabase.table("messages").select("content").eq("type", "user").in_("session_id", session_ids).order("created_at", desc=True).limit(10).execute()

        if not messages_response.data or len(messages_response.data) == 0:
            logger.info(f"No messages found for user {user_id}, returning default prompts")
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "status": "success",
                    "prompts": DEFAULT_PROMPTS,
                    "is_personalized": False,
                    "message": "Default prompts returned"
                }
            )

        # Extract user queries from messages
        user_queries = [msg["content"] for msg in messages_response.data if msg["content"]]

        # Generate personalized prompts using LLM
        personalized_prompts = await generate_personalized_prompts(user_queries)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "status": "success",
                "prompts": personalized_prompts,
                "is_personalized": True,
                "message": "Personalized prompts generated successfully"
            }
        )

    except Exception as e:
        logger.error(f"Error generating prompts for user {user_id}: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": "error",
                "prompts": DEFAULT_PROMPTS,
                "is_personalized": False,
                "message": "Error generating personalized prompts, returning defaults"
            }
        )

@router.post("/prompts/refresh/{user_id}")
async def refresh_user_prompts(user_id: str):
    """
    Generate fresh personalized prompts for a user based on their chat history.
    """
    try:
        # Fetch user's recent chat sessions
        chat_response = supabase.table("chat_sessions").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(10).execute()

        if not chat_response.data or len(chat_response.data) == 0:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "status": "success",
                    "prompts": DEFAULT_PROMPTS,
                    "is_personalized": False,
                    "message": "No chat history found, returning default prompts"
                }
            )

        # Fetch messages from only the most recent 1-2 chat sessions
        recent_sessions = sorted(chat_response.data, key=lambda x: x["created_at"], reverse=True)[:2]
        session_ids = [session["id"] for session in recent_sessions]
        messages_response = supabase.table("messages").select("content").eq("type", "user").in_("session_id", session_ids).order("created_at", desc=True).limit(8).execute()

        if not messages_response.data or len(messages_response.data) == 0:
            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "status": "success",
                    "prompts": DEFAULT_PROMPTS,
                    "is_personalized": False,
                    "message": "No messages found, returning default prompts"
                }
            )

        # Extract user queries
        user_queries = [msg["content"] for msg in messages_response.data if msg["content"]]

        # Generate fresh personalized prompts
        personalized_prompts = await generate_personalized_prompts(user_queries, refresh=True)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "status": "success",
                "prompts": personalized_prompts,
                "is_personalized": True,
                "message": "Fresh personalized prompts generated successfully"
            }
        )

    except Exception as e:
        logger.error(f"Error refreshing prompts for user {user_id}: {str(e)}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": "error",
                "prompts": DEFAULT_PROMPTS,
                "is_personalized": False,
                "message": "Error generating fresh prompts, returning defaults"
            }
        )

async def generate_personalized_prompts(user_queries: List[str], refresh: bool = False) -> List[dict]:
    """
    Generate personalized prompts based on user's previous queries using LLM.
    """
    try:
        import random
        import time

        # If no queries, generate random prompts
        if not user_queries:
            return await generate_random_prompts()

        # Use only recent queries to keep prompts fresh
        recent_queries = user_queries[:6]  # Only most recent 6 queries
        queries_text = "\n".join(recent_queries)

        # Add randomness to the prompt generation
        creativity_level = random.choice(["highly creative", "innovative", "unique", "original", "inventive"])
        variation_instruction = random.choice([
            "Generate completely new and different prompts",
            "Create fresh and original suggestions",
            "Think of novel and unique prompts",
            "Develop creative and diverse ideas"
        ])

        # Add timestamp for uniqueness
        timestamp_seed = int(time.time()) % 1000

        system_prompt = f"""You are a {creativity_level} AI assistant. {variation_instruction} that are related to but different from the user's interests.

Recent user queries (use these for inspiration but DON'T repeat them):
{queries_text}

Randomness seed: {timestamp_seed}

Generate exactly 4 COMPLETELY DIFFERENT and engaging prompt suggestions. Each prompt should:
1. Be actionable and specific
2. Be inspired by their interests but explore NEW directions
3. Be unique and not repetitive of previous suggestions
4. Cover diverse categories and use cases
5. Be creative and thought-provoking

IMPORTANT: If this is a refresh request, generate entirely different prompts from any previous suggestions.

Return ONLY a valid JSON array with this exact structure:
[
  {{"title": "detailed prompt text here", "category": "category name"}},
  {{"title": "detailed prompt text here", "category": "category name"}},
  {{"title": "detailed prompt text here", "category": "category name"}},
  {{"title": "detailed prompt text here", "category": "category name"}}
]

Categories must be one of: Personal, Professional, Technical, Creative, Learning, Health, Finance, Travel, Entertainment

Make each prompt unique, detailed, and inspiring. Avoid generic prompts."""

        # Generate prompts using LLM
        messages = [
            ("system", system_prompt),
            ("human", f"Generate 4 unique and creative prompts. Creativity mode: {creativity_level}. Make them completely different from each other and highly engaging.")
        ]

        response = await llm.ainvoke(messages)

        # Parse the response
        import json
        try:
            # Clean the response - remove any markdown formatting
            content = response.content.strip()
            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()

            prompts = json.loads(content)

            # Validate the response structure
            if isinstance(prompts, list) and len(prompts) == 4:
                for prompt in prompts:
                    if not isinstance(prompt, dict) or 'title' not in prompt or 'category' not in prompt:
                        raise ValueError("Invalid prompt structure")

                return prompts
            else:
                raise ValueError("Invalid response format")

        except (json.JSONDecodeError, ValueError) as e:
            logger.error(f"Error parsing LLM response: {str(e)}")
            logger.error(f"Raw response: {response.content}")
            return await generate_random_prompts()

    except Exception as e:
        logger.error(f"Error generating personalized prompts: {str(e)}")
        return await generate_random_prompts()

async def generate_random_prompts() -> List[dict]:
    """
    Generate completely random prompts when no chat history exists.
    """
    try:
        import random
        import time

        # Add randomness
        creativity_style = random.choice(["imaginative", "innovative", "creative", "original", "unique"])
        prompt_themes = random.choice([
            "productivity and self-improvement",
            "creative projects and hobbies",
            "learning and skill development",
            "lifestyle and wellness",
            "technology and innovation",
            "career and professional growth"
        ])

        timestamp_seed = int(time.time()) % 1000

        system_prompt = f"""Generate 4 completely random, {creativity_style} and diverse prompt suggestions focused on {prompt_themes}.

Randomness seed: {timestamp_seed}

Each prompt should:
1. Be specific and actionable
2. Cover different aspects of life/work/creativity
3. Be engaging and thought-provoking
4. Inspire the user to try something new
5. Be unique and not generic

Return ONLY a valid JSON array:
[
  {{"title": "detailed prompt text here", "category": "category name"}},
  {{"title": "detailed prompt text here", "category": "category name"}},
  {{"title": "detailed prompt text here", "category": "category name"}},
  {{"title": "detailed prompt text here", "category": "category name"}}
]

Categories: Personal, Professional, Technical, Creative, Learning, Health, Finance, Travel, Entertainment

Make each prompt inspiring and unique."""

        messages = [
            ("system", system_prompt),
            ("human", f"Generate 4 completely random and creative prompts. Style: {creativity_style}, Theme: {prompt_themes}")
        ]

        response = await llm.ainvoke(messages)

        import json
        try:
            content = response.content.strip()
            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()

            prompts = json.loads(content)

            if isinstance(prompts, list) and len(prompts) == 4:
                for prompt in prompts:
                    if not isinstance(prompt, dict) or 'title' not in prompt or 'category' not in prompt:
                        raise ValueError("Invalid prompt structure")
                return prompts
            else:
                return DEFAULT_PROMPTS

        except (json.JSONDecodeError, ValueError):
            return DEFAULT_PROMPTS

    except Exception as e:
        logger.error(f"Error generating random prompts: {str(e)}")
        return DEFAULT_PROMPTS