import Button from "react-bootstrap/Button";
import { useRouter } from "next/router";
import { useCallback } from "react";
import useSWR from "swr";
import { useToasts } from "../../../components/Toasts";

function LeaveButton() {
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
  const leaveGroup = useCallback(async (e) => {
    showToast("Left Group!");
    await fetch(`/api/groups/leaveGroup/${code}`, { method: "DELETE" });
    mutateGroupList();
    mutateGroupFreeTime();
    mutateMembersFreeTime();
  });
  return (
    <div className="mb-3">
      <Button onClick={leaveGroup}>Leave</Button>
    </div>
  );
}

export default LeaveButton;
