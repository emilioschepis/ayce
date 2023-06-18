import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

type Props = {
  joinLink: string;
};

const ShareJoinLinkButton: React.FC<Props> = ({ joinLink }) => {
  async function shareLink() {
    if (!navigator.canShare) {
      // Copy the link to the clipboard
      // TODO: display a confirmation popup
      await navigator.clipboard.writeText(joinLink);
      return;
    }

    await navigator.share({
      text: "Join my room on AYCE!",
      url: joinLink,
    });
  }

  return (
    <button
      onClick={() => shareLink()}
      className="flex h-10 w-10 items-center justify-center rounded bg-gray-200 active:bg-gray-300"
    >
      <ClipboardDocumentIcon
        className="h-5 w-5"
        aria-label="Copy invite code"
      />
    </button>
  );
};

export default ShareJoinLinkButton;
