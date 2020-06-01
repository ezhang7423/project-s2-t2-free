// "Create Group" Card

import { useCallback, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { InputGroup, Container, Row, Col } from "react-bootstrap";
import useSWR from "swr";
import { useToasts } from "./Toasts";

function CreateGroupForm() {
  const { showToast } = useToasts();
  const [name, setName] = useState("");
  const { mutate } = useSWR("/api/groups/getUserGroups");

  const createGroup = useCallback(
    async (e) => {
      // override default form submission behavior
      e.preventDefault();
      e.stopPropagation();
      setName("");
      if (name === "") {
        showToast("Added to Group!");
      } else {
        showToast("Added to Group: " + name);
      }
      await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
        }),
      });
      await mutate();
    },
    [name]
  );

  return (
    <Form onSubmit={createGroup}>
      <Form.Group>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>Create New Group</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="Enter New Group Name"
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="submit" className="ml-1">
            Create
          </Button>
        </InputGroup>
      </Form.Group>
    </Form>
  );
}

export default CreateGroupForm;
