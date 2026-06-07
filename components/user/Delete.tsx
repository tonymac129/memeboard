"use client";

import Btn from "../ui/Btn";

interface DeleteProps {
  id: string;
  deleteAccount: (id: string) => Promise<void>;
}

function Delete({ id, deleteAccount }: DeleteProps) {
  async function handleDelete() {
    if (
      confirm(
        "Are you sure you want to permanently delete all the data associated with your MemeBoard account? This action cannot be undone.",
      )
    ) {
      await deleteAccount(id);
      window.location.reload();
    }
  }

  return <Btn text="Delete account" styles="w-fit" onclick={handleDelete} />;
}

export default Delete;
