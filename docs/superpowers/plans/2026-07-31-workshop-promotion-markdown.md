# Workshop 公众号宣传稿配图与排版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不修改原稿的前提下，生成一份包含六张官网截图、适合公众号阅读的新 Markdown 宣传稿及独立图片目录。

**Architecture:** 以桌面原稿作为只读输入，在工作区建立独立暂存目录；通过本地运行的 Workshop 官网获取六张 1080px 宽截图，随后创建排版后的 Markdown 并生成 HTML 预览。所有检查通过后，再把新稿和图片目录复制到桌面，原稿全程用哈希校验保护。

**Tech Stack:** Markdown、Workshop 官网 Vite 本地预览、Codex Browser 截图、Pandoc、POSIX shell 校验工具。

---

## File Structure

- Read only: `/Users/littlemac/Desktop/Workshop宣传稿.md`
- Create: `/Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版.md`
- Create: `/Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版.html`
- Create: `/Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版_assets/01-workshop-hero.png`
- Create: `/Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版_assets/02-scaling-structure.png`
- Create: `/Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版_assets/03-call-for-papers.png`
- Create: `/Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版_assets/04-invited-speakers.png`
- Create: `/Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版_assets/05-awards-submission-dates.png`
- Create: `/Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版_assets/06-organizers.png`
- Publish: `/Users/littlemac/Desktop/Workshop宣传稿-公众号配图版.md`
- Publish: `/Users/littlemac/Desktop/Workshop宣传稿-公众号配图版_assets/`

### Task 1: Protect the Source and Prepare Staging

**Files:**
- Read: `/Users/littlemac/Desktop/Workshop宣传稿.md`
- Create: `/Users/littlemac/Desktop/codex-helper/workshop-promotion-output/`

- [ ] **Step 1: Record the original file hash**

Run:

```bash
sha256sum /Users/littlemac/Desktop/Workshop宣传稿.md
```

Expected: one SHA-256 digest followed by the original path. Preserve the digest for Task 4.

- [ ] **Step 2: Create the staging image directory**

Run:

```bash
mkdir -p /Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版_assets
```

Expected: exit code 0 and no changes under `/Users/littlemac/Desktop/Workshop宣传稿.md`.

### Task 2: Capture Six Website Images

**Files:**
- Read: `/Users/littlemac/Desktop/codex-helper/bimanual-robot-learning.github.io/`
- Create: the six PNG files listed in File Structure

- [ ] **Step 1: Start or reuse the local Workshop preview**

Run:

```bash
npm run dev -- --host 127.0.0.1 --port 4173
```

Expected: Vite reports `Local: http://127.0.0.1:4173/`.

- [ ] **Step 2: Configure the browser viewport**

Use the browser viewport capability at 1080px width. Use sufficient height for each target section; avoid post-capture resizing so every file remains a direct website screenshot.

- [ ] **Step 3: Capture the hero**

Open `http://127.0.0.1:4173/#top`, wait for the exact heading `Scaling vs. Structure?`, and capture the Workshop hero without the following white Introduction section.

Save as:

```text
/Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版_assets/01-workshop-hero.png
```

- [ ] **Step 4: Capture the Scaling/Structure premise**

Use the unique `Introduction` navigation link, wait for the exact `Introduction` heading, and capture the core Context / Scaling view / Structure view content.

Save as:

```text
/Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版_assets/02-scaling-structure.png
```

- [ ] **Step 5: Capture the three topic columns**

Use the unique `Call for Papers` navigation link, wait for the exact heading, and capture the Scale / Structure / Synthesis three-column section.

Save as:

```text
/Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版_assets/03-call-for-papers.png
```

- [ ] **Step 6: Capture the five invited speakers**

Use the unique `Speakers` navigation link, wait for `Invited Speakers`, and capture all five portraits with names and affiliations.

Save as:

```text
/Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版_assets/04-invited-speakers.png
```

- [ ] **Step 7: Capture awards, format, and dates**

Return to `Call for Papers`, scroll to the awards and submission-format area, and capture the two award cards together with the submission requirements and Important Dates sidebar.

Save as:

```text
/Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版_assets/05-awards-submission-dates.png
```

- [ ] **Step 8: Capture the organizers**

Use the unique `Organizers` navigation link, wait for `Workshop Organizers`, and capture all seven organizer cards with names and affiliations.

Save as:

```text
/Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版_assets/06-organizers.png
```

- [ ] **Step 9: Verify image count and widths**

Run:

```bash
find /Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版_assets -type f -name '*.png' | sort
sips -g pixelWidth -g pixelHeight /Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版_assets/*.png
```

Expected: exactly six PNG paths; every `pixelWidth` is `1080`; each image has a positive height and legible text.

### Task 3: Create the Readable Markdown

**Files:**
- Read: `/Users/littlemac/Desktop/Workshop宣传稿.md`
- Create: `/Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版.md`

- [ ] **Step 1: Build the opening**

Keep the current title and subtitle. Place `01-workshop-hero.png` immediately below them, followed by short introductory paragraphs and this compact information block:

```markdown
> **Workshop 核心信息**
>
> - **时间：**2026年9月27日，8:00 AM–12:30 PM EDT
> - **地点：**美国匹兹堡，IROS 2026会场
> - **投稿截止：**2026年8月24日，11:59 PM AOE
> - **篇幅：**正文不超过4页，参考文献不计入页数
> - **链接：**[Workshop 官网](https://bimanual-robot-learning.github.io/)｜[OpenReview 投稿入口](https://openreview.net/group?id=IEEE.org/IROS/2026/Workshop/Bimanual_Manipulation)
```

- [ ] **Step 2: Reflow the technical premise**

Keep the `双臂机器人学习的两个重要维度` section, split long paragraphs into one-to-three-sentence units, and retain this standalone emphasis:

```markdown
**Scaling与Structure不是简单的二选一。**
```

Place `02-scaling-structure.png` after the three bullets describing data scale, coordination structure, and their combination.

- [ ] **Step 3: Reflow the three topic areas**

Keep the three topic headings and bullets. Place `03-call-for-papers.png` after the closing invitation paragraph in `三类重点议题`.

- [ ] **Step 4: Present the speaker section**

Keep all five names and affiliations. Place `04-invited-speakers.png` after the speaker list, followed by the Spotlight Talk, Poster Session, Panel Discussion, and award-session bullets.

- [ ] **Step 5: Consolidate submission, awards, and dates**

Create one section titled `## 投稿、奖项与重要日期`. Within it:

1. Keep the double-blind review, IEEE format, four-page limit, no-appendix, poster, and spotlight requirements.
2. Keep `Best Workshop Paper Award` and `Outstanding Workshop Paper Award` amounts.
3. Keep all four timeline dates.
4. Replace raw URLs with `[IEEE Conference Paper Format](...)` and `[OpenReview 投稿入口](...)`.
5. Place `05-awards-submission-dates.png` after the award and date bullets.

- [ ] **Step 6: Present the team and closing CTA**

Keep all seven organizer names and affiliations, then place `06-organizers.png`. End with:

```markdown
> **投稿截止：2026年8月24日，11:59 PM AOE**
>
> [查看Workshop官网](https://bimanual-robot-learning.github.io/)｜[前往OpenReview投稿](https://openreview.net/group?id=IEEE.org/IROS/2026/Workshop/Bimanual_Manipulation)
```

- [ ] **Step 7: Remove draft-only markers**

Delete every `【配图…】` paragraph and remove all bare URL-only lines. Use these exact relative image references:

```markdown
![Workshop主视觉](Workshop宣传稿-公众号配图版_assets/01-workshop-hero.png)
![Scaling与Structure：双臂机器人学习的两个重要维度](Workshop宣传稿-公众号配图版_assets/02-scaling-structure.png)
![Workshop三类重点议题](Workshop宣传稿-公众号配图版_assets/03-call-for-papers.png)
![Workshop五位特邀嘉宾](Workshop宣传稿-公众号配图版_assets/04-invited-speakers.png)
![论文奖项、投稿要求与重要日期](Workshop宣传稿-公众号配图版_assets/05-awards-submission-dates.png)
![Workshop跨机构组织团队](Workshop宣传稿-公众号配图版_assets/06-organizers.png)
```

### Task 4: Verify and Publish Without Overwriting

**Files:**
- Read: `/Users/littlemac/Desktop/Workshop宣传稿.md`
- Read: staging Markdown and PNG files
- Create: staging HTML preview
- Publish: new Desktop Markdown and image directory

- [ ] **Step 1: Run structural checks**

Run:

```bash
rg -c '^!\\[' /Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版.md
rg -n '【配图|^https?://' /Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版.md
```

Expected: first command prints `6`; second command prints no matches.

- [ ] **Step 2: Verify every referenced image exists**

Resolve the six relative paths against `/Users/littlemac/Desktop/codex-helper/workshop-promotion-output/`. Expected: all six files exist and are non-empty.

- [ ] **Step 3: Generate and inspect an HTML preview**

Run:

```bash
pandoc --standalone --metadata title='Workshop宣传稿-公众号配图版' /Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版.md -o /Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版.html
```

Expected: exit code 0. Open the HTML locally and verify image order, paragraph rhythm, headings, link labels, and mobile-friendly readability.

- [ ] **Step 4: Recheck the original hash**

Run:

```bash
sha256sum /Users/littlemac/Desktop/Workshop宣传稿.md
```

Expected: the digest is identical to Task 1.

- [ ] **Step 5: Publish only the new artifacts**

Copy:

```text
/Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版.md
→ /Users/littlemac/Desktop/Workshop宣传稿-公众号配图版.md

/Users/littlemac/Desktop/codex-helper/workshop-promotion-output/Workshop宣传稿-公众号配图版_assets/
→ /Users/littlemac/Desktop/Workshop宣传稿-公众号配图版_assets/
```

Expected: the two new Desktop outputs exist; `/Users/littlemac/Desktop/Workshop宣传稿.md` remains unchanged.

- [ ] **Step 6: Run final verification**

Repeat the image-count, referenced-file, placeholder, bare-URL, and original-hash checks against the published Desktop output. Expected: all checks pass with six images and no changes to the original.
