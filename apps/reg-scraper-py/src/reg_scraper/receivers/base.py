from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Generic, TypeVar

T = TypeVar("T")


class Receiver(ABC, Generic[T]):
    """Fetches raw data from an external source."""

    @abstractmethod
    async def receive(self) -> T:
        raise NotImplementedError
