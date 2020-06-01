import { useCallback, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { InputGroup, Container, Row, Col } from "react-bootstrap";
import useSWR from "swr";
import { useToasts } from "./Toasts";
import { Accordion, Card } from "react-bootstrap";

function numToTime(num) {
  let str = "";
  if (Math.floor(num / 12) % 12 === 0) {
    str += "12";
  } else {
    str += Math.floor(num / 12) % 12;
  }
  str += ":";
  if ((num % 12) * 5 <= 5) {
    str += "0";
  }
  str += (num % 12) * 5;
  if (num >= 144) {
    str += " PM";
  } else {
    str += " AM";
  }
  return str;
}

// converts time hh:mm AM/PM to minute of the day
function convertTime(str) {
  var min = 0;
  var morn = 0; // 0 if morning, 1 if afternoon
  if (str.charAt(str.length - 2) == "P") {
    morn = 1;
  }
  str = str.slice(0, -3);
  var str_split = str.split(":");

  if (str_split[0] == 12) {
    str_split[0] = 0;
  }

  min = +str_split[0] * 60 + +str_split[1];

  if (morn == 1) {
    min = min + 720;
  }
  return min;
}

function validateForm(
  e,
  isSunday,
  isMonday,
  isTuesday,
  isWednesday,
  isThursday,
  isFriday,
  isSaturday,
  startTime,
  endTime,
  addEvent
) {
  e.preventDefault();
  e.stopPropagation();
  if (convertTime(startTime) >= convertTime(endTime)) {
    window.alert("Start time must be before end time.");
    return false;
  }
  if (
    !isSunday &&
    !isMonday &&
    !isTuesday &&
    !isWednesday &&
    !isThursday &&
    !isFriday &&
    !isSaturday
  ) {
    window.alert("Must select at least one day of the week.");
    return false;
  }
  return addEvent(e);
}

function NewEventForm() {
  const { showToast } = useToasts();
  const { mutate } = useSWR("/api/event");
  const [name, setName] = useState("");

  const [isMonday, setIsMonday] = useState(false);
  const [isTuesday, setIsTuesday] = useState(false);
  const [isWednesday, setIsWednesday] = useState(false);
  const [isThursday, setIsThursday] = useState(false);
  const [isFriday, setIsFriday] = useState(false);
  const [isSaturday, setIsSaturday] = useState(false);
  const [isSunday, setIsSunday] = useState(false);

  const [startTime, setStartTime] = useState("12:00 PM");
  const [endTime, setEndTime] = useState("12:00 PM");

  const timeOptions = [];
  for (let i = 0; i < 288; i++) {
    timeOptions.push(<option>{numToTime(i)}</option>);
  }

  const addEvent = useCallback(
    async (e) => {
      // override default form submission behavior
      e.preventDefault();
      e.stopPropagation();
      setName("");
      setIsMonday(false);
      setIsTuesday(false);
      setIsWednesday(false);
      setIsThursday(false);
      setIsFriday(false);
      setIsSaturday(false);
      setIsSunday(false);
      setStartTime("12:00 PM");
      setEndTime("12:00 PM");
      if (name === "") {
        showToast("Added Event!");
      } else {
        showToast("Added Event: " + name);
      }
      await mutate(
        [
          {
            name: name,
            isMonday: isMonday,
            isTuesday: isTuesday,
            isWednesday: isWednesday,
            isThursday: isThursday,
            isFriday: isFriday,
            isSaturday: isSaturday,
            isSunday: isSunday,
            startTime: startTime,
            endTime: endTime,
          },
        ],
        false
      );
      await fetch("/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          isMonday: isMonday,
          isTuesday: isTuesday,
          isWednesday: isWednesday,
          isThursday: isThursday,
          isFriday: isFriday,
          isSaturday: isSaturday,
          isSunday: isSunday,
          startTime: startTime,
          endTime: endTime,
        }),
      });
      await mutate();
    },
    [
      name,
      isMonday,
      isTuesday,
      isWednesday,
      isThursday,
      isFriday,
      isSaturday,
      isSunday,
      startTime,
      endTime,
    ]
  );

  return (
    <Accordion defaultActiveKey="0" className="mb-3">
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0" className="acc-toggle">
          Create New Event
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <Form
              onSubmit={(e) =>
                validateForm(
                  e,
                  isSunday,
                  isMonday,
                  isTuesday,
                  isWednesday,
                  isThursday,
                  isFriday,
                  isSaturday,
                  startTime,
                  endTime,
                  addEvent
                )
              }
              className="mb-3"
            >
              <Form.Group>
                <Container>
                  <Row>
                    <Col>
                      <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                          <InputGroup.Text>Event Name</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                          placeholder="Untitled"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} md={6}>
                      <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                          <InputGroup.Text>Start Time</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                          as="select"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        >
                          {timeOptions}
                        </Form.Control>
                      </InputGroup>
                    </Col>
                    <Col xs={12} md={6}>
                      <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                          <InputGroup.Text>End Time</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                          as="select"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                        >
                          {timeOptions}
                        </Form.Control>
                      </InputGroup>
                    </Col>
                  </Row>
                  <Row className="justify-content-center">
                    <Col md="auto" className="mb-3">
                      <Form.Check
                        label="Monday"
                        type="switch"
                        id="Monday"
                        checked={isMonday}
                        onChange={(e) => setIsMonday(e.target.checked)}
                      />
                    </Col>
                    <Col md="auto" className="mb-3">
                      <Form.Check
                        label="Tuesday"
                        type="switch"
                        id="Tuesday"
                        checked={isTuesday}
                        onChange={(e) => setIsTuesday(e.target.checked)}
                      />
                    </Col>
                    <Col md="auto" className="mb-3">
                      <Form.Check
                        label="Wednesday"
                        type="switch"
                        id="Wednesday"
                        checked={isWednesday}
                        onChange={(e) => setIsWednesday(e.target.checked)}
                      />
                    </Col>
                    <Col md="auto" className="mb-3">
                      <Form.Check
                        label="Thursday"
                        type="switch"
                        id="Thursday"
                        checked={isThursday}
                        onChange={(e) => setIsThursday(e.target.checked)}
                      />
                    </Col>
                    <Col md="auto" className="mb-3">
                      <Form.Check
                        label="Friday"
                        type="switch"
                        id="Friday"
                        checked={isFriday}
                        onChange={(e) => setIsFriday(e.target.checked)}
                      />
                    </Col>
                    <Col md="auto" className="mb-3">
                      <Form.Check
                        label="Saturday"
                        type="switch"
                        id="Saturday"
                        checked={isSaturday}
                        onChange={(e) => setIsSaturday(e.target.checked)}
                      />
                    </Col>
                    <Col md="auto" className="mb-3">
                      <Form.Check
                        label="Sunday"
                        type="switch"
                        id="Sunday"
                        checked={isSunday}
                        onChange={(e) => setIsSunday(e.target.checked)}
                      />
                    </Col>
                    <Col md="auto" className="mb-3">
                      <Button type="submit">Add Event</Button>
                    </Col>
                  </Row>
                </Container>
              </Form.Group>
            </Form>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}

export default NewEventForm;
