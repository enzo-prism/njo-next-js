type StructuredDataScriptProps = {
  data: Record<string, unknown> | null;
  id?: string;
};

export function StructuredDataScript({ data, id }: StructuredDataScriptProps) {
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
