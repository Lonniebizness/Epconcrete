import { redirect } from 'next/navigation';

// Root simply forwards into the app; middleware handles auth gating.
export default function Home() {
  redirect('/library');
}
