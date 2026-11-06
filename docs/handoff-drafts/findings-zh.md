# 孙华海会议记录调研结果（仅研究，未改站点代码）

调研日：2026-11-06（Asia/Shanghai）  
身份锚定：ORCID `0009-0003-2386-133X`（清华大学工程物理系 / CT·成像）

## 政策与站点约束（重要）

| 项 | 结论 |
|---|---|
| `papers.bib` + `publication-proof.yml` + `publication-policy.ts` | **仍然只允许** `kind: journal_article` / BibTeX `@article`；证据域名限于 PubMed 或 Sage |
| 会议条目 | 应按已更新的 `PUBLICATION_POLICY.md` 写入 `src/data/conferences.yml`，类型仅为 `oral` / `poster` / `proceedings`，**不得**混入 `papers.bib` |
| 当前仓库 | `src/data/conferences.yml` 已存在且 `records: []`（空）；本目录草稿待 Huahai 授权后再合并 |

## 核实通过、建议可进「会议」区的条目

| # | 类型 | 作者（顺序） | 题目 | 会议 | 地点 | 日期 | DOI | 官方 URL | 状态分类 |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 会议论文集论文 `proceedings` | Huahai Sun; Liang Li | Research on x-ray induced acoustic computerized tomography in vascular imaging | Developments in X-Ray Tomography XV（SPIE Optics + Photonics / Optical Engineering + Applications 2024） | San Diego, California, USA | 2024-08（Crossref 会议段 18–23 日；proceedings.com 写 19–22 日；论文集出版 2024-10-04） | 10.1117/12.3027548 | https://doi.org/10.1117/12.3027548 | **已正式收入 SPIE 论文集并有 DOI**。现场口头/海报形式未从官方日程核实，故不标 oral/poster |
| 2 | 口头报告 `oral` | Huahai Sun; Wenyu Zhang; Liang Li | DiffuCoCT: Dual-Domain Collaborative Diffusion Network for Dual-Detector CT Scatter Correction | The 18th International Meeting on Fully Three-Dimensional Image Reconstruction in Radiology and Nuclear Medicine（Fully3D 2025） | Shanghai, China | 2025-05（会议 5/27–5/30；oral 日程记 16:40–17:00） | （无） | https://hqlab.sjtu.edu.cn/fully3d-2025/program （oral PDF：同站 `/assets/Program_oral-DTM5bS1N.pdf`） | **口头报告**；官方 oral 日程可核实。Crossref/OpenAlex **未找到** 同题 DOI/论文集记录。海报日程 PDF 中 **无** 孙华海 |

## 未找到 / 排除

| 类别 | 说明 |
|---|---|
| IEEE NSS/MIC/RTSD | 公开检索未见与目标 ORCID/清华成像方向匹配、且作者含 Huahai Sun 的记录（IEEE 接口被墙，主要依赖 Crossref/网页检索） |
| AAPM | 未见匹配摘要 |
| SPIE Medical Imaging（非 Tomography XV） | 未见额外命中 |
| Fully3D 海报 | `Program_poster-CzdmytUy.pdf` 全文检索无 Huahai Sun |
| ORCID / OpenAlex | 目标 ORCID 仅 3 篇期刊（站点已有），无会议作品 |
| 同名干扰 | 煤田火区遥感 ORCID `0009-0000-9969-3035` 等，主题/单位不符，已排除 |

## 相关但非「会议」的发现（供参考，不进 conferences.yml）

- 《中国体视学与图像分析》2025 年第 4 期 397–405：李亮、孙华海、汪令行、朱磊，《2026中国体视学学会CBCT金属伪影消除挑战赛(CSS-MAR 2026)》——**期刊论文**，若要上「文章」区需走期刊白名单扩容流程，不是会议条目。

## 草稿文件（本目录）

- `conferences.yml` — 可直接对照 `src/utils/conferences.ts` 的草稿
- `papers-conference.bib` — 仅 SPIE 一篇的 `@inproceedings` 草稿（**不要**并入 `papers.bib`）
- `publication-proof-conference-draft.yml` — 说明性证据笔记（站点会议区无 proof.yml 机制）
- `search-log.md` — 检索日志
- `orcid-works.json` / `spie-3027548.json` / Fully3D 日程 PDF 等原始抓取

## 建议下一步（需 Huahai 明确授权后再改代码/发布）

1. 确认是否把上表 2 条写入 `src/data/conferences.yml`  
2. SPIE 条目是否接受「仅论文集、不标注口头/海报」  
3. 是否还有未公开登记的 NSS/MIC、国内核学会/医学物理会议日程（需他本人提供录用通知或日程截图才能补）  
