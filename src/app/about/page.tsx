// About page: bilingual two-pane layout — EN left, VI right, always both visible.
// The lang switch in TopBar has no effect here; both languages are shown side by side.
import Link from "next/link";

function EnBody() {
  return (
    <div className="about-body">
      <p className="lead">
        Asa is a small journal about quiet, observable, stubbornly verifiable
        software — kept by one person, updated when there&apos;s something worth
        writing down.
      </p>
      <p>
        Most entries are short. The longer ones come paired with a Reader &amp;
        Notes view and a minimal slide deck, so the same idea can be skimmed,
        studied, or spoken from.
      </p>
      <p>
        The site is plain Next.js, statically exported, served by Nginx. No
        analytics, no comments, no popups. Email is the back channel.
      </p>
      <div className="about-card">
        <div className="pane">
          <div className="label">what&apos;s here</div>
          <p>
            Essays on agent harnesses, control loops, and the small choices that
            decide whether software keeps working.
          </p>
        </div>
        <div className="pane">
          <div className="label">colophon</div>
          <p>
            Set in Source Serif 4 for body, JetBrains Mono for metadata. Single
            terracotta accent. No images, by choice.
          </p>
        </div>
      </div>
    </div>
  );
}

function ViBody() {
  return (
    <div className="about-body">
      <p className="lead">
        Asa là sổ tay nhỏ về phần mềm — yên tĩnh, quan sát được, và bướng bỉnh
        dễ kiểm chứng. Một người viết, cập nhật khi có gì đáng ghi lại.
      </p>
      <p>
        Phần lớn ngắn. Bài dài đi kèm bản Reader &amp; Notes và slide deck tối
        giản, để cùng một ý có thể đọc lướt, học kỹ, hoặc trình bày.
      </p>
      <p>
        Trang chạy Next.js export tĩnh, Nginx phục vụ. Không analytics, không
        comment, không popup. Email là kênh phản hồi.
      </p>
      <div className="about-card">
        <div className="pane">
          <div className="label">nội dung</div>
          <p>
            Ghi chép về agent harness, vòng điều khiển, và những lựa chọn nhỏ
            quyết định phần mềm có tiếp tục chạy hay không.
          </p>
        </div>
        <div className="pane">
          <div className="label">colophon</div>
          <p>
            Source Serif 4 cho thân chữ, JetBrains Mono cho metadata. Một sắc
            đất nung duy nhất. Không hình minh hoạ — theo chủ ý.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="page">
      <div className="container narrow">
        <nav className="crumbs">
          <Link href="/">asa</Link>
          <span className="sep">/</span>
          <span style={{ color: "var(--ink)" }}>about</span>
        </nav>

        <header className="post-head">
          <div className="date">about · est. 2024</div>
          <h1>A small journal, written slowly.</h1>
        </header>

        {/* Bilingual two-pane: EN left, VI right */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
            alignItems: "start",
          }}
        >
          <EnBody />
          <ViBody />
        </div>
      </div>
    </main>
  );
}
