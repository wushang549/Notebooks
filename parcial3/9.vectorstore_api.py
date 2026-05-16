from uuid import uuid4

import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer


class Metadata(BaseModel):
    source: str
    category: str

    class Config:
        extra = "forbid"


class Document:
    def __init__(self, text: str, metadata: dict[str, str]):
        self.text = text
        self.metadata = metadata


class SearchResult:
    def __init__(self, score: float, document: Document):
        self.score = score
        self.document = document


class FilteredVectorStore:
    def __init__(self, embedding_model: SentenceTransformer):
        self.embedding_model = embedding_model
        self.documents: list[Document] = []
        self.embeddings: np.ndarray | None = None

    def add_documents(self, documents: list[Document]):
        if not documents:
            return

        texts = [document.text for document in documents]
        new_embeddings = self.embedding_model.encode(
            texts,
            convert_to_numpy=True,
            normalize_embeddings=True,
            show_progress_bar=False,
        )

        self.documents.extend(documents)
        if self.embeddings is None:
            self.embeddings = new_embeddings
        else:
            self.embeddings = np.vstack([self.embeddings, new_embeddings])

    def search(
        self,
        query: str,
        top_k: int = 5,
        metadata_filter: dict[str, str] | None = None,
    ) -> list[SearchResult]:
        if not self.documents or self.embeddings is None:
            return []

        metadata_filter = metadata_filter or {}
        candidate_indices = [
            index
            for index, document in enumerate(self.documents)
            if all(document.metadata.get(key) == value for key, value in metadata_filter.items())
        ]
        if not candidate_indices:
            return []

        query_embedding = self.embedding_model.encode(
            query,
            convert_to_numpy=True,
            normalize_embeddings=True,
            show_progress_bar=False,
        )
        candidate_embeddings = self.embeddings[candidate_indices]
        scores = candidate_embeddings @ query_embedding
        result_count = min(top_k, len(candidate_indices))
        top_positions = np.argsort(scores)[::-1][:result_count]

        return [
            SearchResult(
                score=float(scores[position]),
                document=self.documents[candidate_indices[position]],
            )
            for position in top_positions
        ]


class CreateDocumentRequest(BaseModel):
    text: str = Field(min_length=1)
    metadata: Metadata

    class Config:
        extra = "forbid"


class CreateDocumentsRequest(BaseModel):
    documents: list[CreateDocumentRequest]

    class Config:
        extra = "forbid"


class SearchRequest(BaseModel):
    query: str = Field(min_length=1)
    top_k: int = Field(default=5, ge=1)
    metadata_filter: dict[str, str] | None = None

    class Config:
        extra = "forbid"


app = FastAPI()
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
vector_store = FilteredVectorStore(embedding_model)
documents_by_id: dict[str, Document] = {}
allowed_filter_keys = {"source", "category", "original_document_id"}


def split_text(text: str) -> list[str]:
    if len(text) <= 500:
        return [text]
    return [text[index:index + 400] for index in range(0, len(text), 400)]


@app.post("/documents")
def create_documents(request: CreateDocumentsRequest):
    created_documents = []
    chunk_documents = []

    for document_request in request.documents:
        document_id = str(uuid4())
        metadata = document_request.metadata.dict()
        documents_by_id[document_id] = Document(
            text=document_request.text,
            metadata=metadata,
        )

        for chunk in split_text(document_request.text):
            chunk_metadata = {
                **metadata,
                "original_document_id": document_id,
            }
            chunk_documents.append(Document(text=chunk, metadata=chunk_metadata))

        created_documents.append({
            "id": document_id,
            "text": document_request.text,
            "metadata": metadata,
        })

    vector_store.add_documents(chunk_documents)
    return {"documents": created_documents}


@app.get("/documents/{document_id}")
def get_document(document_id: str):
    document = documents_by_id.get(document_id)
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")

    return {
        "id": document_id,
        "text": document.text,
        "metadata": document.metadata,
    }


@app.post("/documents/search")
def search_documents(request: SearchRequest):
    metadata_filter = request.metadata_filter or {}
    invalid_keys = set(metadata_filter) - allowed_filter_keys
    if invalid_keys:
        raise HTTPException(status_code=422, detail="Invalid metadata filter")

    results = vector_store.search(
        query=request.query,
        top_k=request.top_k,
        metadata_filter=metadata_filter,
    )

    return {
        "results": [
            {
                "similarity_percentage": round(result.score * 100, 2),
                "text": result.document.text,
                "metadata": result.document.metadata,
            }
            for result in results
        ]
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
