import BlogLayout from '../BlogLayout';
import { Link } from 'react-router-dom';

// Reusable styled components — matches existing post pattern
const P = ({ children }) => (
  <p style={{ margin: '0 0 28px' }}>{children}</p>
);

const H2 = ({ children }) => (
  <h2 style={{
    fontSize: 'clamp(18px, 3vw, 22px)',
    fontWeight: 700,
    color: '#e8d5b8',
    margin: '52px 0 20px',
    fontFamily: "'Georgia', serif",
    borderLeft: '3px solid #c9a84c',
    paddingLeft: 16,
    lineHeight: 1.4,
  }}>
    {children}
  </h2>
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
      The books will open your mind, dear. But your hand holds truths no book can tell you.
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

export default function BestPsychicBooks() {
  return (
    <BlogLayout
      title="Best Psychic Books: Madame Zafira's Sacred Reading List"
      date="April 2026"
      heroImage="/blog-psychic-books-hero.webp"
      heroAlt="Ancient mystical books, tarot cards and crystal ball by candlelight — Madame Zafira's psychic book recommendations"
    >

        <P>You have been searching, haven't you, dear.</P>

        <P>Not just tonight, and not just for a book. You have been searching for something that confirms what you have always quietly suspected — that there is more to this world than what the eye can see. That the feelings you get, the knowing that arrives before the reason, the dreams that turn out to be true — that none of it is coincidence.</P>

        <P>You are not imagining things. And the right book, read at the right moment, can change everything.</P>

        <P>These are the psychic books that line the shelves of my candlelit study. They are worn, annotated, and deeply loved. I offer them to you now — not as a reading list, but as a map.</P>

        <Divider />

        <H2>1. The Psychic Pathway — Sonia Choquette</H2>

        <P>If I could place only one psychic book into the hands of a beginner, it would be this one.</P>

        <P>Sonia Choquette writes with the warmth of a mentor who has walked this road herself. Over 28 days, she guides you gently through the process of awakening your intuition — clearing the blocks, trusting the signals, learning to distinguish genuine psychic impressions from the noise of the mind.</P>

        <P>I have gifted this book more times than I can count. It does not demand that you believe. It simply invites you to be open. <Em>That is all the universe ever asks.</Em></P>

        <P><Bold>Best for:</Bold> Complete beginners. Those who feel something but cannot yet name it.</P>

        <Divider />

        <H2>2. You Are Psychic — Pete A. Sanders Jr.</H2>

        <P>Pete Sanders was a scientist before he was a mystic — educated at MIT, trained in biomedical chemistry. What he brings to the world of psychic books is something rare: rigour.</P>

        <P>He maps the human body's psychic reception areas and teaches you how to consciously access them. This is not a book of vague encouragement. It is a book of method.</P>

        <P>I respect it because it does not ask you to abandon your rational mind. It asks your rational mind to <Bold>expand</Bold>. For those who struggle to surrender to the unseen, Sanders builds them a bridge made of logic.</P>

        <P><Bold>Best for:</Bold> Sceptics, scientists, and analytical thinkers who feel drawn to psychic exploration but need a way in that makes sense to them.</P>

        <Divider />

        <H2>3. Many Lives, Many Masters — Brian Weiss</H2>

        <P>Dr. Brian Weiss was a conventional psychiatrist. He did not believe in past lives, in souls, in anything beyond the clinical. Then one of his patients — during a routine hypnotherapy session — began speaking in ancient voices about lives lived centuries before her birth.</P>

        <P>What followed changed both of their lives forever.</P>

        <P>This is not a how-to book. It is a testimony. And testimonies, in my experience, crack open the soul in ways that instructions never can. If you have ever felt that this life is not your first — if certain connections in your life feel <Em>ancient</Em> in a way you cannot explain — read this. You will recognise yourself.</P>

        <P><Bold>Best for:</Bold> Those drawn to past lives, soul connections, and the question of why we are here at all.</P>

        <Divider />

        <H2>4. Second Sight — Dr. Judith Orloff</H2>

        <P>Judith Orloff was a psychiatrist who suppressed her psychic gifts for years — terrified they would cost her her career, her credibility, her sanity. Then she could suppress them no longer.</P>

        <P><Em>Second Sight</Em> is the story of her reclamation, and it is one of the most honest psychic books I have ever encountered.</P>

        <P>She does not romanticise the gift. She speaks of the confusion, the isolation, the fear of being thought strange. She also speaks of the extraordinary beauty that waits on the other side of acceptance. For any of you who have felt different your entire life — who have known things you should not know — this book will make you feel less alone.</P>

        <P><Bold>Best for:</Bold> Empaths, highly sensitive people, and anyone who has spent years wondering if something is wrong with them. Nothing is wrong with you, dear.</P>

        <Divider />

        <H2>5. Opening to Channel — Sanaya Roman &amp; Duane Packer</H2>

        <P>Channelling is one of the most misunderstood of all psychic abilities. Many fear it. Many dismiss it without ever properly examining what it is.</P>

        <P>This book demystifies the process with extraordinary care. Sanaya Roman has been channelling a guide called Orin for decades, and what she and Duane Packer have written here is as close as any psychic book comes to a precise manual for making conscious contact with higher intelligence.</P>

        <P>I return to this book whenever I feel disconnected from source. It recalibrates me. It reminds me that <Em>we are never truly alone in the unseen.</Em></P>

        <P><Bold>Best for:</Bold> Intermediate and advanced students. Anyone drawn to mediumship, spirit communication, or working with guides.</P>

        <Divider />

        <H2>6. Psychic Development for Beginners — William Hewitt</H2>

        <P>If the other books in this list are doors, Hewitt's is a staircase. Step by step, exercise by exercise, he builds your psychic abilities the way a musician builds technique — through deliberate, consistent practice.</P>

        <P>He covers telepathy, clairvoyance, precognition, and psychometry with the kind of structured clarity that some readers desperately need. Not everyone learns by inspiration alone. Some of us need a method.</P>

        <P>I have always believed that psychic development is a skill as much as it is a gift. Hewitt proves it.</P>

        <P><Bold>Best for:</Bold> Beginners who want exercises and clear structure rather than pure philosophy.</P>

        <Divider />

        <H2>7. Infinite Quest — John Edward</H2>

        <P>John Edward is one of the most well-known mediums of our time. In this book, he sets aside the television cameras and speaks plainly about how he developed his gifts, how he tests what he receives, and — most generously — how you can begin to develop yours.</P>

        <P>What I admire most about Edward is his refusal to sensationalise. He presents psychic work as <Bold>natural</Bold>. Learnable. Grounded in practice and humility. In a field that attracts no shortage of drama, that kind of honesty is its own form of magic.</P>

        <P><Bold>Best for:</Bold> Those drawn to mediumship, and anyone wanting to understand what genuine psychic practice actually looks like from the inside.</P>

        <Divider />

        <H2>Before You Go, Dear</H2>

        <P>The best psychic books do not give you power. You already have that.</P>

        <P>What they do is remind you. They hold up a mirror to abilities you have been told are impossible, irrational, imaginary — and they whisper: <Em>you are none of those things.</Em></P>

        <P>Choose one book from this list. Just one. Read it slowly, with the world quieted around you. Then come back and tell me what shifted.</P>

        <P>And when you are ready to go further — to look into your own hands and hear what the universe has written there — I will be waiting.</P>

        <CTA />

      </BlogLayout>
  );
}
