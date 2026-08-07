# LAMO OS — TinhGon OS Implementation Plan

> **Control plane kết nối con người + AI agents + dữ liệu + ứng dụng + automation + security.**
> Công ty: LAMO | Phiên bản: V1 | Trạng thái: Planning

---

## 📋 Tổng quan

LAMO OS là AI Operating System nội bộ của công ty LAMO, lấy cảm hứng từ **Cloudflare OS** (kernel) và **Agency-Agents** (thư viện nhân sự AI). Mục tiêu: chuyển LAMO từ "dùng nhiều công cụ AI" thành một công ty có **AI control plane** thực sự.

### Triết lý kiến trúc

| Layer | Công cụ | Vai trò |
|-------|---------|---------|
| **Kernel** | Cloudflare OS (fork) | Control plane, chat UI, agent runner |
| **Nhân sự** | Agency-Agents (curated) | Thư viện chuyên gia AI |
| **Automation** | n8n | Workflow engine (không thay thế) |
| **Data** | Directus / EspoCRM / Woo | Systems of record (không thay thế) |
| **Gateway** | Gatekeepers | Permission layer trước mọi action |

---

## ✅ Success Criteria (Measurable)

- [ ] Chat UI chạy được trên Cloudflare Account của LAMO
- [ ] 12 agents hoạt động ổn định (Engineering + Marketing + Operations)
- [ ] Gatekeeper chặn 100% agent action chưa được approve
- [ ] Approval Engine có simulation trước khi execute
- [ ] Visa Operations Blueprint chạy end-to-end: chat → agent → approve → execute
- [ ] Audit trail ghi lại mọi action của agent
- [ ] Zero auto-approve trên production data

---

## 🏗️ Tech Stack

| Lớp | Công nghệ | Lý do |
|-----|-----------|-------|
| Runtime | Cloudflare Workers (TypeScript) | Cloudflare OS yêu cầu |
| Package manager | pnpm | Cloudflare OS default |
| Agent framework | Cloudflare OS kernel | Fork + brand thành LAMO OS |
| Agent library | Agency-Agents (selective) | Không copy tất cả 140, chọn 12 |
| Orchestrator | lamo-orchestrator (custom) | Routing logic riêng cho LAMO |
| Model router | lamo-model-router | **Multi-provider**: Anthropic + Gemini + OpenAI — route theo task complexity |
| Policy engine | lamo-policy-engine | Rules: ai được làm gì |
| Storage | Cloudflare KV + D1 | State, audit log, agent memory |
| Auth | Cloudflare Access | SSO cho team LAMO |
| Directus | Self-hosted trên VPS `190.102.110.208` | ✅ Confirmed — API endpoint sẵn |
| Integrations | REST API qua Gatekeepers | n8n, Directus, GitHub, Google, Espo, Woo |

---

## 📁 Cấu trúc repo: `lamo-os`

```
lamo-os/
├── apps/
│   ├── shell/                  # Chat UI (fork Cloudflare OS shell)
│   ├── approval-center/        # Approval Engine UI
│   └── gadgets/                # Mini apps do agent tạo ra
│       ├── visa-operations/
│       ├── marketing-command/
│       └── engineering-command/
├── packages/
│   ├── lamo-orchestrator/      # Điều phối agent
│   ├── lamo-model-router/      # Chọn model phù hợp
│   ├── lamo-policy-engine/     # Luật quyền hạn
│   ├── lamo-agent-registry/    # Danh mục agent đã approved
│   └── lamo-knowledge/         # Context về LAMO cho agent
├── agents/                     # Agent definitions (fork Agency-Agents)
│   ├── engineering/
│   ├── marketing/
│   ├── operations/
│   └── visa/
├── gatekeepers/                # Permission wrappers
│   ├── github/
│   ├── google/
│   ├── n8n/
│   ├── directus/
│   ├── espocrm/
│   ├── woocommerce/
│   ├── wordpress/
│   └── mautic/
├── blueprints/                 # Workflow templates
│   └── visa-operations/
├── wrangler.toml               # Cloudflare deployment config
└── docs/
    └── PLAN-lamo-os.md
```

---

## 🚦 Phân chia Phase (theo thứ tự ưu tiên)

```
Phase 1: Kernel           → Chạy được LAMO OS shell
Phase 2: Agent Registry   → 12 agent đầu tiên hoạt động
Phase 3: Knowledge        → Agent hiểu LAMO & Vietnam Entry Visa
Phase 4: Gatekeepers      → Permission layer cho 8 integrations
Phase 5: Approval Engine  → Simulation + audit trail
Phase 6: LAMO Apps        → 3 app đầu tiên (Gadgets)
Phase 7: Autonomous       → LAMO Manager orchestration loop
```

> **🎯 Vertical Slice mốc đầu tiên:** Phase 1 + Phase 4 (WordPress + n8n) + Visa Operations Blueprint
> Knowledge source chính: **WordPress** (Vietnam Entry Visa website content)
> Chứng minh toàn bộ luồng: chat → agent → permission → simulate → approve → execute

---

## 📌 PHASE 1 — Kernel Setup

**Mục tiêu:** LAMO OS shell chạy được, branding xong, repo private tạo xong.

| # | Task | Agent | Input → Output → Verify |
|---|------|-------|--------------------------|
| 1.1 | Tạo private repo `lamo-os` trên GitHub LAMO | `backend-specialist` | GitHub account → repo tạo xong → `git clone` hoạt động |
| 1.2 | Fork/clone Cloudflare OS vào repo | `backend-specialist` | CF OS source → code trong `lamo-os/` → `pnpm install` không lỗi |
| 1.3 | Cấu hình upstream remote để nhận update | `backend-specialist` | `git remote add upstream` → `git fetch upstream` OK |
| 1.4 | LAMO branding: tên, logo, màu sắc | `frontend-specialist` | Brand assets → UI hiện "LAMO OS" thay "Cloudflare OS" |
| 1.5 | Cấu hình `wrangler.toml` + custom domain `os.tinhgon.com` | `backend-specialist` | CF API key → deploy lên account → shell live tại `os.tinhgon.com` |
| 1.6 | Kết nối model provider đầu tiên | `backend-specialist` | API keys (Anthropic + Gemini + OpenAI) → chat test "Hello" trả lời được |
| 1.7 | Setup Cloudflare Access + Google Workspace OIDC cho `@tinhgon.com` | `security-auditor` | CF Access policy + Google OIDC → chỉ `@tinhgon.com` email vào được `os.tinhgon.com` |

**Blockers:** Cần Cloudflare account với Workers Paid plan.
**Rollback:** Revert `wrangler.toml`, shell vẫn chạy local với `pnpm dev`.

---

## 📌 PHASE 2 — Agent Registry

**Mục tiêu:** Curate 12 agent phù hợp nhất cho LAMO V1. Không import 140 agent mù quáng.

| # | Task | Agent | Input → Output → Verify |
|---|------|-------|--------------------------|
| 2.1 | Tạo `lamo-agent-registry` package | `backend-specialist` | - → package skeleton → import hoạt động |
| 2.2 | Script auto-import từ agency-agents repo | `backend-specialist` | Script chạy → 12 agent files đúng thư mục |
| 2.3 | Tạo `lamo-orchestrator` — routing agent theo task | `backend-specialist` | Task type → agent được chọn → log routing |
| 2.4 | Tạo `lamo-model-router` — chọn model theo chi phí | `backend-specialist` | Task complexity → model phù hợp (Flash/Pro) |
| 2.5 | Test 12 agent trong sandbox | `test-engineer` | Agent prompts → response OK → không crash |

### 12 Agent curated cho V1

| # | Agent | Division | Dùng cho LAMO |
|---|-------|----------|---------------|
| 1 | Frontend Developer | Engineering | UI, web |
| 2 | Backend Architect | Engineering | API, infra |
| 3 | DevOps Automator | Engineering | CI/CD, server |
| 4 | Security Analyst | Security | Audit, threat |
| 5 | QA Engineer | Testing | Test cases |
| 6 | Content Strategist | Marketing | Blog, SEO content |
| 7 | SEO Specialist | Marketing | Keywords, audit |
| 8 | Product Manager | Product | Roadmap, specs |
| 9 | Project Manager | PM | Tasks, timeline |
| 10 | Visa Operations Specialist | Operations (custom LAMO) | eVisa workflow |
| 11 | Technical Writer | Engineering | Docs, SOPs |
| 12 | Data Analyst | Product | Reports, metrics |

**Blockers:** Phase 1 hoàn thành.
**Rollback:** Disable agent trong registry, orchestrator skip agent đó.

---

## 📌 PHASE 3 — Knowledge Layer

**Mục tiêu:** Agent hiểu LAMO — business, sản phẩm, infra, SOP, Vietnam Entry Visa.

| # | Task | Agent | Input → Output → Verify |
|---|------|-------|--------------------------|
| 3.1 | Tạo `lamo-knowledge` package với loader interface | `backend-specialist` | - → package với abstract loader |
| 3.2 | Kết nối Directus (data source chính) | `backend-specialist` | Directus API key → agent đọc được products/content |
| 3.3 | Kết nối GitHub (code context) | `backend-specialist` | GitHub token (read-only) → agent đọc repo structure |
| 3.4 | Kết nối Google Docs/Drive (SOPs) | `backend-specialist` | Google OAuth → agent đọc SOP documents |
| 3.5 | Kết nối WordPress (website content) | `backend-specialist` | WP REST API key → agent đọc posts/pages |
| 3.6 | Nạp LAMO context vào agent system prompt | `backend-specialist` | Knowledge sources → agents có context LAMO + Visa |
| 3.7 | Test: hỏi "LAMO làm gì?" — agent phải trả lời đúng | `test-engineer` | Agent với context → trả lời chính xác |

**Blockers:** Phase 2 + API keys từ tất cả systems.
**Rollback:** Disable knowledge loader, agent dùng base prompt.

---

## 📌 PHASE 4 — Gatekeepers

**Mục tiêu:** Mọi agent action ra ngoài phải đi qua Gatekeeper. Mặc định: không có quyền gì.

**Cấu trúc Gatekeeper chuẩn:**
```typescript
interface Gatekeeper {
  resource: string;
  action: string;
  scope: string[];
  requiresApproval: boolean;
  simulate: (action) => SimulatedResult;
  execute: (action, approvalId) => Result;
  audit: (action, result) => AuditEntry;
}
```

| # | Gatekeeper | Priority | Scope V1 | Verify |
|---|------------|----------|----------|--------|
| 4.1 | `gatekeeper-github` | P0 | read:repo, create:issue | Tạo issue → phải qua approve |
| 4.2 | `gatekeeper-google` | P0 | read:docs (read-only) | Đọc SOP → không cần approve |
| 4.3 | `gatekeeper-n8n` | P1 | trigger:workflow | Trigger → phải approve |
| 4.4 | `gatekeeper-directus` | P1 | read:all, write:content | Write → approve; Read → OK |
| 4.5 | `gatekeeper-espocrm` | P2 | read:contacts, create:task | Create → approve |
| 4.6 | `gatekeeper-woocommerce` | P2 | read:orders (chỉ read V1) | Write bị block hoàn toàn |
| 4.7 | `gatekeeper-wordpress` | P2 | read, create:draft | Publish bị block V1 |
| 4.8 | `gatekeeper-mautic` | P3 | read:contacts (chỉ read V1) | Write bị block V1 |

**Blockers:** Phase 3.
**Rollback:** Set `requiresApproval: true` cho tất cả, disable execute.

---

## 📌 PHASE 5 — Approval Engine

**Mục tiêu:** Agent không bao giờ bị block. Pending actions xếp hàng, người duyệt khi rảnh.

### UI: Approval Center

```
PENDING ACTIONS                              [3 chờ duyệt]
─────────────────────────────────────────────────────────
 Agent │ Action       │ Resource │ Risk │ Before │ After
 ──────┼──────────────┼──────────┼──────┼────────┼──────
 SEO   │ Update post  │  WP      │ Low  │ [view] │ [view]
 Visa  │ Create task  │  Espo    │ Low  │  N/A   │ [view]
 Dev   │ Create PR    │  GitHub  │ Med  │ [view] │ [view]
─────────────────────────────────────────────────────────
[Approve Selected] [Reject Selected] [Approve All Low Risk]
```

| # | Task | Agent | Input → Output → Verify |
|---|------|-------|--------------------------|
| 5.1 | Pending queue: agent action → xếp hàng với `trace_id` | `backend-specialist` | Agent action → queued → visible trong UI |
| 5.2 | Simulation engine: giả lập kết quả, agent chạy tiếp | `backend-specialist` | Action payload → simulated result → agent không block |
| 5.3 | Approval Center UI: bảng [Approve]/[Reject] | `frontend-specialist` | Pending queue → UI hoạt động |
| 5.4 | Audit trail: immutable log trong D1 | `backend-specialist` | Action + approval → log ghi được → không xóa được |
| 5.5 | Rollback metadata: lưu state trước execute | `backend-specialist` | Pre-state → rollback available sau approve |
| 5.6 | Risk scoring: tự động Low/Medium/High | `backend-specialist` | Action type → risk label tự động |

**Blockers:** Phase 4.
**Rollback:** Reject tất cả pending, không có gì vào production.

---

## 📌 PHASE 6 — LAMO Apps (Gadgets)

**Mục tiêu:** 3 mini-app chuyên biệt, mỗi app là giao diện cho một bộ phận LAMO.

### App 1: Visa Operations
- Đơn xin visa pending + checklist xử lý
- Agent hỗ trợ trả lời câu hỏi khách hàng
- Trigger n8n workflow qua gatekeeper
- Approval flow: agent đề xuất → staff approve → execute

### App 2: Marketing Command Center
- Content calendar + SEO audit dashboard
- Agent viết draft content, phân tích competitor
- Approval: draft → review → publish (không auto)

### App 3: Engineering Command Center
- GitHub issues overview + deployment status
- Agent suggest fixes, tạo PR qua gatekeeper-github
- Approval: PR draft → senior review → merge

| # | Task | Agent | Input → Output → Verify |
|---|------|-------|--------------------------|
| 6.1 | Visa Operations App scaffold | `frontend-specialist` | Design spec → app shell chạy |
| 6.2 | Tích hợp với gatekeeper-n8n | `backend-specialist` | n8n webhook → trigger qua approval |
| 6.3 | Marketing Command Center scaffold | `frontend-specialist` | Design spec → app shell chạy |
| 6.4 | Tích hợp Marketing với gatekeeper-wordpress | `backend-specialist` | WP API → agent tạo draft được |
| 6.5 | Engineering Command Center scaffold | `frontend-specialist` | Design spec → app shell chạy |
| 6.6 | Tích hợp Engineering với gatekeeper-github | `backend-specialist` | GitHub API → agent tạo issue/PR qua approve |

**Blockers:** Phase 5.
**Rollback:** Disable app, dùng shell chat thẳng.

---

## 📌 PHASE 7 — Autonomous Workflows

**Mục tiêu:** LAMO Manager — agent điều phối multi-agent pipeline với human approval ở điểm quan trọng.

> ⚠️ **Chỉ triển khai sau khi Phase 1–6 ổn định ≥ 4 tuần liên tục**

### Flow mẫu: SEO Audit + Deploy

```
User: "Audit SEO Vietnam Entry Visa và triển khai sửa đổi an toàn"
          ↓
    LAMO Manager (plan + delegate)
          ↓
    SEO Agent → Content Agent → Technical SEO Agent → WP Agent → QA Agent
          ↓ (mỗi bước có)
    Gatekeeper check → Simulation → Human Approval → Execute → Audit Log
```

| # | Task | Agent | Input → Output → Verify |
|---|------|-------|--------------------------|
| 7.1 | LAMO Manager: plan + delegate | `backend-specialist` | Task → sub-tasks cho đúng agent |
| 7.2 | Pipeline executor: sequential/parallel | `backend-specialist` | Task graph → execution với log |
| 7.3 | Evaluate step: agent tự đánh giá output | `backend-specialist` | Output → quality score → proceed/retry |
| 7.4 | Human checkpoint tại risk actions | `backend-specialist` | Risk action → mandatory review |
| 7.5 | E2E test: SEO audit blueprint full pipeline | `test-engineer` | Full run → không data leak → audit complete |

---

## 🛡️ V1 Guard Rails — KHÔNG LÀM

> Đây là các giới hạn bắt buộc cho V1. Không tranh luận. Không bypass.

| ❌ Cấm hoàn toàn | ✅ Thay bằng |
|------------------|-------------|
| 140 agent chạy cùng lúc | 12 agent curated, registry control |
| Agent SSH root vào VPS | Không bao giờ — chỉ dùng API |
| Agent query DB production trực tiếp | Qua Directus/Espo API + gatekeeper |
| Auto approve everything | Simulation + human approve |
| Tự động publish WordPress | Draft → approve → publish |
| Publish ads trực tiếp | Pending → human review |
| Tự merge main branch | PR draft → human merge |
| Tự động refund/payment | Không trong V1 |
| Self-host CF OS production trên VPS | Cloudflare deploy (workerd chưa stable) |

---

## 🗺️ Deployment Architecture (V1)

```
Cloudflare Account LAMO
        │
    LAMO OS (Workers)
    ┌───┴──────────────┐
  Shell            Approval
  (Chat UI)        (Center UI)
        │
   Gatekeepers Layer
        │
┌──────┬─────┬────────┬──────┬────┬────┬───────┐
│ GH   │ n8n │Directus│ Espo │ WP │Woo │ Mautic│
└──────┴─────┴────────┴──────┴────┴────┴───────┘
        │
   LAMO VPS (190.102.110.208:2287)
   n8n | Directus | EspoCRM | WooCommerce
```

---

## 📊 Timeline ước tính

| Phase | Thời gian | Phụ thuộc |
|-------|-----------|-----------|
| Phase 1: Kernel | 1–2 tuần | Cloudflare account |
| Phase 2: Agents | 1 tuần | Phase 1 |
| Phase 3: Knowledge | 1–2 tuần | Phase 2 + API keys |
| Phase 4: Gatekeepers | 2–3 tuần | Phase 3 |
| Phase 5: Approval | 2 tuần | Phase 4 |
| Phase 6: Apps | 3–4 tuần | Phase 5 |
| Phase 7: Autonomous | 2–3 tuần | Phase 6 ổn định 4 tuần |
| **Tổng V1** | **~3–4 tháng** | |

---

## ✅ Architecture Decisions — Đã xác nhận

| # | Câu hỏi | Quyết định |
|---|---------|------------|
| 1 | Cloudflare Account | ✅ Đã có, Workers Paid plan sẵn sàng |
| 2 | Model Provider | ✅ Multi-provider: Anthropic + Gemini + OpenAI — lamo-model-router tự route theo task |
| 3 | Domain | ✅ `https://os.tinhgon.com` |
| 4 | Auth email domain | ✅ `@tinhgon.com` qua Google Workspace — dùng Cloudflare Access + Google OIDC |
| 5 | Directus | ✅ Self-hosted trên VPS `190.102.110.208`, API sẵn |
| 6 | Knowledge priority (Visa) | ✅ WordPress — chứa nội dung Vietnam Entry Visa website |
| 7 | Agent list | ✅ Giữ nguyên 12 agent như plan |

> [!NOTE]
> Tất cả quyết định kiến trúc đã được xác nhận. Plan sẵn sàng để implementation.

---

## ✅ Phase X — Verification Checklist

Trước khi coi V1 hoàn thành:

- [ ] Shell chat chạy tại `https://os.tinhgon.com` (không phải localhost)
- [ ] CF Access chặn user ngoài `@tinhgon.com` (test bằng Gmail khác)
- [ ] 12 agent respond đúng trong sandbox
- [ ] Visa Operations Blueprint chạy E2E: chat → agent → simulate → approve → execute
- [ ] Gatekeeper block 100% unauthorized action (manual pentest)
- [ ] Audit trail ghi đầy đủ mọi action
- [ ] Không có auto-execute trên production data
- [ ] Rollback test: reject pending action → state về trước đó
- [ ] `python .agents/skills/vulnerability-scanner/scripts/security_scan.py .`
- [ ] `python .agents/skills/webapp-testing/scripts/playwright_runner.py https://os.tinhgon.com --screenshot`

---

## 🔗 References

- Cloudflare OS: https://github.com/cloudflare/cloudflare-os
- Agency-Agents: https://github.com/msitarzewski/agency-agents
- LAMO VPS: `190.102.110.208` (port 2287)

---

*Plan created: 2026-08-08 | Status: ✅ ALL DECISIONS CONFIRMED — Ready for implementation*
