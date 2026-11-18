-- Row count of every table in the public schema, one "table<TAB>count" line each.
-- Taken from the live database at backup time and from the restored copy, then compared.
SELECT format('%s	%s', c.relname,
       (xpath('/row/n/text()', query_to_xml(format('SELECT count(*) AS n FROM public.%I', c.relname), false, true, '')))[1]::text)
FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')
ORDER BY c.relname;
