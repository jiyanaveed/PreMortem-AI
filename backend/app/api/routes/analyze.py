from fastapi import APIRouter, Depends, HTTPException

from app.core.config import Settings, get_settings
from app.models.premortem import AnalyzeRequest, PremortemAnalysisResponse
from app.services.analysis_service import analyze
from app.utils.scenarios import scenario_title_for_id
from app.utils.text import meaningful_char_count, normalize_whitespace, trim_for_llm

router = APIRouter(tags=["analyze"])


@router.post("/analyze", response_model=PremortemAnalysisResponse)
def analyze_route(
    body: AnalyzeRequest,
    settings: Settings = Depends(get_settings),
) -> PremortemAnalysisResponse:
    cleaned = normalize_whitespace(body.documentText)
    if meaningful_char_count(cleaned) < settings.min_document_chars:
        raise HTTPException(
            status_code=400,
            detail=(
                f"documentText too short: need at least {settings.min_document_chars} "
                "non-whitespace characters after cleaning"
            ),
        )
    sid = (body.scenarioId or "").strip()
    if not sid:
        raise HTTPException(status_code=400, detail="scenarioId is required")

    doc_title = (body.documentTitle or "").strip() or "Untitled enterprise document"
    scen_title = scenario_title_for_id(sid, body.scenarioTitle)

    merged = body.model_copy(
        update={
            "documentText": trim_for_llm(cleaned),
            "documentTitle": doc_title,
            "scenarioTitle": scen_title,
            "scenarioId": sid,
        },
    )
    return analyze(merged, settings)
