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
- Public booking uses server functions backed by PostgreSQL transactions and non-overlap constraints; customer upsert and appointment insert are atomic to prevent orphaned records and concurrent conflicts.
- Public catalog reads use a publishable client with narrow anonymous policies; private booking actions verify an email plus a high-entropy hashed token and use service-only database functions, never direct browser table access.
- Email notifications are an atomic database outbox; only a configured server-side worker may mark them sent after provider acceptance, so unconfigured email never blocks or falsely confirms a booking.
- Google Calendar confirmation, cancellation and rescheduling belong to the separate administrative application; provider credentials and calls stay server-side through the Google Calendar/Gmail connectors.
- Keep schema changes in managed Drizzle migrations, database types generated, and booking validation/types/query options in shared modules so the UI and separate administrative integration follow one contract.
