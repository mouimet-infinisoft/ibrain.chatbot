import { ChatWindow } from "@/components/ChatWindow";

export default function AgentsPage() {

  return (
    <ChatWindow
      endpoint="api/chat/retrieval_agents"
      emptyStateComponent={<></>}
      showIngestForm={true}
      showIntermediateStepsToggle={true}
      placeholder={'How can i help?'}
      emoji="💡"
      titleText="iBrain AI Companion"
    ></ChatWindow>
  );
}
