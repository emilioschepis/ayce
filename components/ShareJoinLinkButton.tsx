import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

type Props = {
  joinLink: string;
};

const ShareJoinLinkButton: React.FC<Props> = ({ joinLink }) => {
  async function shareLink() {
    if (typeof navigator.share === "function") {
      // Share the link natively
      await navigator.share({
        title: "AYCE",
        text: "Share access to this room",
        url: joinLink,
      });
    } else {
      // Copy the link to the clipboard
      await navigator.clipboard.writeText(joinLink);
    }
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
