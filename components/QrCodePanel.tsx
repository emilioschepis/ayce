import { Dialog, Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Fragment } from "react";

import { QueryKey } from "~/lib/query";
import { supabaseClient } from "~/lib/supabase";

type Props = {
  roomId: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

const QrCodePanel: React.FC<Props> = ({ roomId, isOpen, setOpen }) => {
  const { data: code } = useQuery(
    [QueryKey.CODE, roomId],
    async () => {
      const response = await supabaseClient.functions.invoke("generate-code", {
        body: { roomId },
      });

      if (response.error || response.data.error) {
        throw response.error || response.data.error;
      }

      return response.data as { url: string };
    },
    {
      enabled: isOpen,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" onClose={() => setOpen(false)} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-25"
            aria-hidden="true"
          />
        </Transition.Child>
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-md rounded-lg bg-white p-8">
              <Dialog.Title className="text-lg font-bold">
                Code for the room
              </Dialog.Title>
              <Dialog.Description className="italic text-gray-800">
                Show this code to your guests to let them join the room.
              </Dialog.Description>

              <div className="relative mx-auto mt-4 h-64 w-64">
                {code?.url ? (
                  <Image src={code.url} alt={roomId} width={256} height={256} />
                ) : null}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default QrCodePanel;
