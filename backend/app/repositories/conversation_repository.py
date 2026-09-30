from uuid import UUID

from sqlalchemy.orm import Session

from app.models import Conversation


class ConversationRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def get(self, context_id: UUID) -> Conversation | None:
        return self._session.get(Conversation, context_id)

    def save(
        self, context_id: UUID, prompt: str, target_language: str, result_ids: list[int]
    ) -> Conversation:
        """Creates the conversation, or updates it when the contextId already exists."""
        conversation = self.get(context_id) or Conversation(context_id=context_id)
        conversation.prompt = prompt
        conversation.target_language = target_language
        conversation.result_ids = result_ids
        self._session.add(conversation)
        self._session.commit()
        return conversation
