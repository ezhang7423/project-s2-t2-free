import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import { useCallback } from "react";
import useSWR from "swr";
import { useToasts } from "../../../components/Toasts";

function JoinButton() {
  const router = useRouter();
  const { code } = router.query;
  const { mutate: mutateGroupList } = useSWR(
    `/api/groups/getGroupInfo/${code}`
  );
  const { mutate: mutateGroupFreeTime } = useSWR(
    `/api/groups/getGroupFreeTime/${code}`
  );
  const { mutate: mutateMembersFreeTime } = useSWR(
    `/api/groups/getUsersAndEvents/${code}`
  );
  const { showToast } = useToasts();
  const joinGroup = useCallback(async () => {
    showToast("Joined Group!");
    await fetch(`/api/groups/joinGroup/${code}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
      }),
    });
    mutateGroupList();
    mutateGroupFreeTime();
    mutateMembersFreeTime();
  });
  return (
    <div className="mb-3 mr-2">
      <Button onClick={joinGroup}>Join</Button>
    </div>
  );
}

export default JoinButton;
