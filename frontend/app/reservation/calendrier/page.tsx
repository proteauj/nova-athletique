import CalendrierClient from './CalendrierClient';

type PageProps = {
  searchParams?: Promise<{
    mode?: string;
  }>;
};

export default async function CalendrierPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const mode = params?.mode;

  return <CalendrierClient mode={mode} />;
}