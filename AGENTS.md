<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep chat trigger matching and answer wording in `src/lib/chat-rules.ts`, covered by `src/test/chat-rules.test.ts`; route components render replies only. Why: the teacher-facing wording and trigger words change often and must stay verifiable.
- Keep the consecutive-failure transition in `getChatTurn`, with the counter owned by the chat component; stop classification after support escalation until a fresh session. Why: HU4 escalation must be testable without duplicating reply logic in the view.
