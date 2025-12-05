---
title: "Agentic engineering without lock-in"
description: "From GitHub Copilot skeptic to agentic engineering enthusiast. Follow my journey discovering Claude 3.5 Sonnet, exploring multi-agent workflows, and ultimately building a powerful, lock-in-free coding setup"
pubDate: "Dec 08 2025"
---

## Chasing the summit

The race to the summit that represents the best coding Large Language Model (LLM) started a long time ago, and we have yet to see who will arrive first. It feels like one of those mountain ultramarathon races such as the Madeira Island Ultra Trail (MIUT) with distances over 100km and elevation gains of more than 6,000 meters—except the competitors have no idea how long they'll need to run or how much they'll need to climb, because the finish line is actually unknown.

One player has definitely put a considerable gap on the chasing group: Anthropic. In my personal experience, the coding LLM that gave me that magical "A-HA" moment was Claude 3.5 Sonnet in conjunction with Cursor. That was the turning point of my experience coding alongside an LLM. Before that, I wasn't really interested in the topic, although I had already been using GitHub Copilot since its early days. Back then, I had no idea which model was powering that experience—and no motivation or curiosity to find out. That was probably because, even though the experience was positive and helpful, it never felt groundbreaking in the sense that it would make me totally rethink how I write code—or perhaps not even write most of the code myself and manage multiple agents instead. But Claude 3.5 Sonnet was enough motivation to make me dig deeper and understand how to leverage AI in my workflow.

I was a happy user of Claude 3.5 Sonnet (and later versions) with Cursor for months, thinking that would be it—in my mind, it would be pretty difficult to beat. I couldn't have been more wrong. Two weeks ago, I saw a Claude Code demo along with Claude Opus 4.5, and I was fascinated by how much is possible once you rewire your brain and understand that you can manage multiple agents, each with their own specific role, working together on the same project. All while focusing your attention on more complex problems—or even improving specifications or writing new ones to feed into another agent. I wish I had discovered it sooner, but better late than never, right?

## My own agentic engineering journey

As you probably expected, I'm now diving deeper into tools like Claude Code and learning how to leverage them to build software. Although Claude Code felt amazing, I wasn't sure about subscribing while other players could appear in a few weeks with something even better—as has been happening if we look at how close together the last best coding LLMs were released.

As someone who wants freedom but still wants access to great software and AI models, I started searching for the pieces I needed to meet the following requirements while spending the least amount of money on subscriptions:

- Access to recent and powerful coding models such as Claude Opus 4.5, Claude Sonnet 4.5, GPT-5.1, and Gemini 3 Pro
- An agentic coding assistant as close as possible to Claude Code
- An IDE-integrated coding agent
- Bring Your Own Key (BYOK) policy

After an entire evening of searching, here's what I found and was able to put together:

- **[GitHub Copilot Pro](https://github.com/features/copilot/plans)** subscription for $10/mo (with a free 1-month trial), which offers me the models I wanted at a fair price
- **[OpenCode](https://opencode.ai/)**, "the open source AI coding agent" as a Claude Code alternative that provides agentic coding assistance, supports BYOK, and can be integrated with various IDEs for a customizable, lock-in-free workflow.
- **[Zed](https://zed.dev/)**, which not only lets me choose any model I have access to through GitHub Copilot Pro for autocompletion, but also integrates nicely with OpenCode using the [ACP protocol](https://zed.dev/acp).

## The meta layer

The first version of this article, which was really raw, was written entirely by me. After putting out all the ideas I wanted to convey, I reached out to Claude Opus 4.5 for help ensuring my grammar was correct, the text was clear, and there wasn't any false or incorrect information about the mentioned models and tools.

And that's pretty much how I leverage coding agents when I'm actively writing code in my IDE of choice. In most situations, I know I can write code faster without focusing too much on details because I'll be able to sharpen those rough edges with the AI coding agent's help. Also, when the code I need to write is too boilerplate-heavy, I do it the other way around: I let the agent take care of the boilerplate and then only need to sprinkle in some code to get a good output.
