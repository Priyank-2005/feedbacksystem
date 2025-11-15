import FeedbackDetailClient from "../../../components/FeedbackDetailClient";

export default async function FeedbackDetailPage({ params }: { params: any }) {
  const p = await params;          // <- unwrap the Promise
  const id = p?.id;
  return <FeedbackDetailClient id={id} />;
}