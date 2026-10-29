import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDownRight, ArrowRight, Heart, MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";

const examples = [
  {
    label: "THE COMPLIMENT",
    message: "icl, your paintings make me feel like I can breathe a little slower.",
    icon: Sparkles,
    accent: "bg-amber-100 text-amber-700",
    rotation: "-rotate-2",
  },
  {
    label: "THE LITTLE SECRET",
    message: "icl, I had the biggest crush on you in school and never said a word.",
    icon: Heart,
    accent: "bg-rose-100 text-rose-700",
    rotation: "rotate-2",
  },
  {
    label: "THE QUESTION",
    message: "icl, what’s one thing you wish people asked you more often?",
    icon: MessageCircle,
    accent: "bg-violet-100 text-violet-700",
    rotation: "-rotate-1",
  },
];

const steps = [
  {
    number: "01",
    title: "Make your link",
    description: "Get your own little corner for honest notes and unexpected messages.",
  },
  {
    number: "02",
    title: "Put it out there",
    description: "Share it with friends, your group chat, or absolutely nobody in particular.",
  },
  {
    number: "03",
    title: "See what people say",
    description: "Get the sweet, the surprising, and the things people meant to tell you.",
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden bg-[#faf9f6] text-zinc-950">
      <section className="relative mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-12">
        <div className="relative z-10 mx-auto w-full max-w-2xl lg:mx-0">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3.5 py-2 text-sm font-medium text-zinc-700 shadow-sm">
            <span className="size-2 rounded-full bg-lime-500" />
            A little more real. A lot more you.
          </div>
          <h1 className="max-w-2xl text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            Say the thing
            <br />
            <span className="relative inline-block">
              you mean.
              <span className="absolute -bottom-1 left-0 -z-10 h-3 w-full -rotate-2 rounded-full bg-lime-300 sm:h-4" />
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-zinc-600 sm:text-xl">
            A secret compliment. A long-kept crush. A question you’ve always
            wanted to ask. Send the honest thing, anonymously.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-12 gap-2 rounded-xl bg-zinc-950 px-6 text-base text-white hover:bg-zinc-800"
              nativeButton={false}
              render={<Link href="/signup" />}
            >
              Get your link <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-xl border-zinc-300 bg-white px-6 text-base"
              nativeButton={false}
              render={<Link href="/signin" />}
            >
              I already have one
            </Button>
          </div>
          <p className="mt-4 text-sm text-zinc-500">
            No perfect words needed. Just be real.
          </p>
        </div>

        <div className="relative mx-auto flex w-full max-w-lg items-center justify-center py-4 sm:py-8 lg:py-12">
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 size-[19rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-200/60 blur-3xl sm:size-[25rem]"
          />
          <div className="relative w-full max-w-md">
            <div className="absolute -right-2 -top-8 z-10 rotate-6 rounded-full bg-zinc-950 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-lg sm:-right-8">
              straight from the heart
            </div>
            <div className="space-y-4">
              {examples.map((example) => {
                const Icon = example.icon;
                return (
                  <Card
                    key={example.label}
                    className={`relative border border-zinc-200/80 bg-white shadow-xl shadow-zinc-900/5 ${example.rotation}`}
                  >
                    <CardHeader className="grid-cols-[auto_1fr] grid-rows-1 items-center gap-3 pb-2">
                      <div
                        className={`flex size-9 items-center justify-center rounded-xl ${example.accent}`}
                      >
                        <Icon className="size-4" />
                      </div>
                      <CardDescription className="text-[11px] font-bold tracking-[0.14em] text-zinc-500">
                        {example.label}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base font-medium leading-7 text-zinc-800 sm:text-lg">
                        “{example.message}”
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="absolute -bottom-12 -left-3 flex -rotate-6 items-center gap-2 text-sm font-semibold text-zinc-600 sm:-left-12">
              <ArrowDownRight className="size-5 text-lime-700" />
              The stuff that stays unsent
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200/80 bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-12">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-lime-700">
              How it works
            </p>
            <h2 className="mt-4 max-w-md text-3xl font-bold tracking-tight sm:text-4xl">
              Easy to share.
              <br />
              Hard to forget.
            </h2>
            <p className="mt-4 max-w-md leading-7 text-zinc-600">
              Give people a way to say what they really think, without making
              it a whole thing.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {steps.map((step) => (
              <Card
                key={step.number}
                className="border-zinc-200 bg-[#faf9f6] shadow-none"
              >
                <CardHeader>
                  <CardDescription className="font-mono text-xs font-bold tracking-widest text-lime-800">
                    {step.number}
                  </CardDescription>
                  <CardTitle className="mt-2 text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-zinc-600">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-7 px-5 py-16 sm:px-8 sm:py-20 md:flex-row md:items-center lg:px-12">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-lime-700">
            Your turn
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready for the honest stuff?
          </h2>
          <p className="mt-3 max-w-xl leading-7 text-zinc-600">
            Make a link, share it when you feel like it, and see what people
            have been meaning to tell you.
          </p>
        </div>
        <Button
          size="lg"
          className="h-12 gap-2 rounded-xl bg-zinc-950 px-6 text-base text-white hover:bg-zinc-800"
          nativeButton={false}
          render={<Link href="/signup" />}
        >
          Make your link <ArrowRight className="size-4" />
        </Button>
      </section>
    </div>
  );
}
