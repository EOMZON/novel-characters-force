
# Novel Characters Force 当前 vs 理想架构 · 2026-09-28

~~~mermaid
flowchart TB
    Source[Text Source] --> Import[Import Adapter]
    Import --> Document[SourceDocument]
    Document --> Provider[ExtractionProvider]
    Provider --> Candidate[ExtractionCandidate]
    Candidate --> Review[Human Review]
    Review --> Graph[Normalized CharacterGraph]
    Graph --> Focus[GraphFocusSelector]
    Focus --> VM[GraphViewModel]
    VM --> Viewer[CharacterGraphViewer]
    Graph --> Export[Static Export]

    Document --> EventCandidate[Event Candidate]
    EventCandidate --> Timeline[Timeline Sibling]
    Timeline --- IDs[characterId / eventId / sourceAnchor]
~~~

## 当前

~~~text
Source
→ Local Agent Bridge
→ Candidate JSON
→ Review
→ CharacterGraph
→ Existing Viewer
→ Export
~~~

## 理想

~~~text
Source
→ Import Adapter
→ ExtractionProvider
→ Candidate
→ Review
→ Normalized Domain
→ Focus / Projection
→ Viewer
→ Export / Save
~~~

## 硬边界

~~~text
Source != Candidate
Candidate != Reviewed Graph
Domain != Provider
Domain != Renderer
Viewer filter != Domain mutation
Timeline != CharacterGraph v1
API key != Browser persistence
~~~

## 当前缺口

1. Browser Gate。
2. feature → test integration。
3. Density / Focus。
4. Public Try。
5. One-click Provider。
6. Timeline sibling。
