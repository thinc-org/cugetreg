from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Generic, TypeVar

TIn = TypeVar("TIn")
TOut = TypeVar("TOut")


class Processor(ABC, Generic[TIn, TOut]):
    """Transforms raw data into structured domain models."""

    @abstractmethod
    def process(self, data: TIn) -> TOut:
        raise NotImplementedError
