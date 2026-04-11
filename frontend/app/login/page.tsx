import LoginClient from './LoginClient';

type PageProps = {
  searchParams?: Promise<{
    redirect?: string;
  }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const redirect = params?.redirect;

  return <LoginClient redirect={redirect} />;
}