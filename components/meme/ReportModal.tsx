"use client";

import type { ReportType } from "@/types/Meme";
import { reportMeme } from "@/app/memes/[id]/actions";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import Modal from "../ui/Modal";
import Btn from "../ui/Btn";

const reportOptions = [
  "Harassment or hate speech",
  "NSFW or violence",
  "Spam or scam",
  "Copyright infringement",
  "Duplicate content",
  "Not a meme",
];

interface ReportModalProps {
  memeId: number;
  setReporting: React.Dispatch<React.SetStateAction<boolean>>;
}

function ReportModal({ memeId, setReporting }: ReportModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [newReport, setNewReport] = useState<ReportType>({
    selectedOptions: [],
  });

  async function handleSubmit() {
    if (newReport.selectedOptions.length > 0) {
      setLoading(true);
      await reportMeme(memeId, newReport);
      setReporting(false);
      setTimeout(() => {
        alert(
          "Report submitted! Thanks for keeping the community a safe and welcoming place for everyone :)",
        );
      }, 300);
    }
  }

  return (
    <Modal closeModal={() => setReporting(false)}>
      <div className="px-10 py-5 flex flex-col gap-y-3">
        <h2 className="text-black dark:text-white text-2xl font-bold">
          Report meme
        </h2>
        <div className="max-h-70 flex flex-col gap-y-1 overflow-auto">
          {reportOptions.map((option, i) => (
            <label
              key={i}
              className="text-black dark:text-zinc-300 w-fit cursor-pointer flex items-center gap-x-3 py-2"
            >
              <div className="group">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={newReport.selectedOptions.includes(option)}
                  onChange={() => {
                    setNewReport((prev) => {
                      return {
                        ...prev,
                        selectedOptions: newReport.selectedOptions.includes(
                          option,
                        )
                          ? newReport.selectedOptions.filter(
                              (t) => t !== option,
                            )
                          : [...prev.selectedOptions, option],
                      };
                    });
                  }}
                />
                <div
                  className="w-4.5 h-4.5 rounded border-2 border-zinc-700 text-zinc-100 dark:text-zinc-950 flex items-center justify-center
                   group-has-checked:border-green-600 group-has-checked:bg-green-600"
                >
                  {newReport.selectedOptions.includes(option) && (
                    <FaCheck size={13} />
                  )}
                </div>
              </div>
              {option}
            </label>
          ))}
        </div>
        <label className="flex flex-col gap-y-1 text-black dark:text-zinc-300 text-sm">
          Additional feedback
          <textarea
            className="text-base border-2 border-zinc-700 rounded px-4 py-2 text-black dark:text-zinc-300 outline-none resize-none h-25"
            placeholder="Anything else? (optional)"
            value={newReport.feedback || ""}
            onChange={(e) =>
              setNewReport({ ...newReport, feedback: e.target.value })
            }
          ></textarea>
        </label>
        <div className="flex gap-x-3 mt-2">
          <Btn
            text={loading ? "Loading..." : "Submit"}
            onclick={handleSubmit}
            styles="w-fit"
            primary
          />
          <Btn
            text="Cancel"
            onclick={() => setReporting(false)}
            styles="w-fit"
          />
        </div>
      </div>
    </Modal>
  );
}

export default ReportModal;
