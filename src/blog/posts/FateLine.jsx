import BlogLayout from '../BlogLayout';
import { Link } from 'react-router-dom';

const heroImage = '/fate-line-destiny-hands.webp';

const P = ({ children }) => (
  <p style={{ margin: '0 0 28px' }}>{children}</p>
);

const H2 = ({ children }) => (
  <h2 style={{
    fontSize: 'clamp(18px, 3vw, 22px)',
    fontWeight: 700,
    color: '#ffffff',
    margin: '52px 0 20px',
    fontFamily: "'Georgia', serif",
    borderLeft: '3px solid #c9a84c',
    paddingLeft: 16,
    lineHeight: 1.4,
  }}>
    {children}
  </h2>
);

const H3 = ({ children }) => (
  <h3 style={{
    fontSize: 'clamp(15px, 2.5vw, 18px)',
    fontWeight: 700,
    color: '#c9a84c',
    margin: '36px 0 14px',
    fontFamily: "'Georgia', serif",
    lineHeight: 1.4,
  }}>
    {children}
  </h3>
);

const Divider = () => (
  <div style={{
    textAlign: 'center',
    color: '#c9a84c',
    margin: '40px 0',
    letterSpacing: 8,
    opacity: 0.5,
    fontSize: 12,
  }}>
    ✦ ✦ ✦
  </div>
);

const Bold = ({ children }) => (
  <strong style={{ color: '#c9a84c', fontWeight: 700 }}>{children}</strong>
);

const Em = ({ children }) => (
  <em style={{ color: '#b0a090', fontStyle: 'italic' }}>{children}</em>
);

const CTA = () => (
  <div style={{
    margin: '52px 0 0',
    padding: '32px 28px',
    background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(176,64,90,0.08))',
    border: '1px solid rgba(201,168,76,0.25)',
    borderRadius: 12,
    textAlign: 'center',
  }}>
    <div style={{
      fontSize: 13,
      letterSpacing: 3,
      color: '#c9a84c',
      textTransform: 'uppercase',
      marginBottom: 16,
      fontFamily: "'Georgia', serif",
    }}>
      ✦ &nbsp; Continue the Reading &nbsp; ✦
    </div>
    <p style={{
      fontSize: 16,
      color: '#d4c4a8',
      margin: '0 0 24px',
      lineHeight: 1.7,
      fontFamily: "'Georgia', serif",
      fontStyle: 'italic',
    }}>
      The lines only tell part of your story, dear. Let me see your hand properly.
    </p>
    <Link to="/" style={{
      display: 'inline-block',
      background: 'linear-gradient(135deg, #c9a84c, #b8943a)',
      color: '#0d0a14',
      textDecoration: 'none',
      padding: '14px 32px',
      borderRadius: 8,
      fontFamily: "'Georgia', serif",
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: 1,
    }}>
      Let Madame Zafira Read Your Palm →
    </Link>
  </div>
);

export default function FateLine() {
  return (
    <BlogLayout
      title="What Your Fate Line Really Says About Your Destiny"
      date="April 2026"
      heroImage={heroImage}
      heroAlt="Two hands cradling a glowing galaxy — palmistry fate line"
    >

      <P>There's a line on your palm that has always fascinated me more than any other, dear. Not because it's the most dramatic, or even the easiest to spot — but because of what people feel when they finally find it.</P>

      <P>Relief. Recognition. Like something they already knew has just been confirmed.</P>

      <P>That's the fate line. And today, I want to tell you everything about it.</P>

      <Divider />

      <H2>What Is the Fate Line?</H2>

      <P>The fate line — sometimes called the destiny line or the Saturn line — runs vertically up the centre of your palm, usually starting somewhere near the wrist and travelling upward toward the base of your middle finger.</P>

      <P>Unlike the heart line or the life line, not everyone has a fate line. Some palms show a clear, deep groove running almost the full length of the hand. Others show a faint, broken trail. And some show nothing at all — at least not at first glance.</P>

      <P>None of these is better or worse than the others. They're just different stories.</P>

      <Divider />

      <H2>Where Does Your Fate Line Begin?</H2>

      <P>The starting point of your fate line tells me a great deal about the shape of your path.</P>

      <P><Bold>Starting from the wrist (base of the palm):</Bold> You've had a strong sense of direction from an early age. Your path has felt like yours — even when life got complicated. There's an old soul quality to people with this starting point.</P>

      <P><Bold>Starting from the middle of the palm:</Bold> Your real momentum came later. Maybe your twenties felt like searching, and something clicked around 30 — a career shift, a relationship, a decision that changed everything. That's not delay, dear. That's discernment.</P>

      <P><Bold>Starting from the life line:</Bold> Your early life and your sense of purpose were deeply entwined — often shaped by family, upbringing, or a strong personal drive. You've had to work to separate your path from other people's expectations of you.</P>

      <P><Bold>Starting from the Mount of Luna (the outer edge of the palm):</Bold> Your destiny has been shaped significantly by other people — by love, collaboration, or public life. You don't walk your path alone, and honestly, you wouldn't want to.</P>

      <Divider />

      <H2>What Does Your Fate Line Look Like?</H2>

      <P><Bold>A long, deep, unbroken line</Bold> running straight to the middle finger suggests a focused, purposeful life. You've known what you want for a long time, and you go after it.</P>

      <P><Bold>A faint or thin line</Bold> doesn't mean a weak destiny — it often means a flexible one. Your path has many possible directions, and you have more freedom to shape it than most.</P>

      <P><Bold>A broken fate line</Bold> is one I see often, and I want to be clear: it is not a bad sign. Breaks in the fate line usually mark significant turning points — a career change, a period of rebuilding, a deliberate pivot. The line picks up again because you do too.</P>

      <P><Bold>Multiple fate lines running parallel</Bold> suggest someone with more than one calling. You've probably always struggled to pick just one thing — and maybe you shouldn't have to.</P>

      <P><Bold>A fate line that shifts direction</Bold> — perhaps veering toward the index finger or the ring finger — tells me your priorities have changed, or will. The index finger speaks to ambition and leadership. The ring finger to creativity, recognition, and the desire to be truly seen.</P>

      <Divider />

      <H2>What If You Don't Have a Fate Line?</H2>

      <P>Then you, dear, are gloriously ungoverned by convention.</P>

      <P>People without a fate line are often the most adaptable, the most spontaneous, the least predictable. Their destiny isn't written in a straight line because it refuses to be. They tend to make their own rules — and more often than not, it works out beautifully for them.</P>

      <Divider />

      <H2>When Does the Fate Line Change?</H2>

      <P>Here's something that surprises people: your palm lines are not fixed. They shift — subtly, slowly — as you change. The fate line in particular responds to the choices you make, the identity you step into, the life you decide to actually live.</P>

      <P>I've seen fate lines deepen in people who finally commit to something they love. I've seen breaks appear during periods of genuine transformation. Your palm is not a prediction carved in stone. <Em>It's a living map.</Em></P>

      <Divider />

      <H2>What Your Fate Line Is Really Telling You</H2>

      <P>More than anything, the fate line reflects your relationship with purpose. Not success, not achievement — purpose. The sense that your life has direction and meaning that belongs specifically to you.</P>

      <P>Some people find that early. Some find it after everything falls apart and they have to rebuild. Some find it in pieces, in multiple places, in unexpected forms.</P>

      <P>But dear — it finds everyone eventually.</P>

      <P>And if you've ever looked at your palm and felt something stir? That's not coincidence. <Em>That's recognition.</Em></P>

      <CTA />

    </BlogLayout>
  );
}
