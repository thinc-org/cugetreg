from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Generic, TypeVar

T = TypeVar("T")


class Exporter(ABC, Generic[T]):
    """Persists processed data to a target system."""

    @abstractmethod
    def export(self, data: T) -> None:
        raise NotImplementedError
