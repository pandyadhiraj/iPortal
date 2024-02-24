import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import { useState } from 'react';
import { subCompInternStudent } from "../../../services/StudentServices";

function CompletedinternshipForm() {

    const [Provider, setProvider] = useState('')
    const [FromDuration, setFromDuration] = useState('')
    const [ToDuration, setToDuration] = useState('')
    const [WhatFor, setWhatFor] = useState('')
    const [Domain, setDomain] = useState('')

    function handleSubmit(event) {
        event.preventDefault()
        const requestBody = {
            Provider,
            FromDuration,
            ToDuration,
            WhatFor,
            Domain,
        };
        subCompInternStudent(requestBody)
    }

    return (

        <Container style={{ marginTop: '50px' }}>
            <Row className="vh-100 d-flex justify-content-center align-items-center">
                <Col md={8} lg={10} xs={12}>
                    <div className="border border-2 border-primary"></div>
                    <Card className="shadow px-4">
                        <Card.Body>
                            <div className="mb-3 mt-md-4">
                                <h2 className="fw-bold mb-2 text-center text-uppercase ">Enter details about completed internship</h2>
                                <div className="mb-3">
                                    <Form onSubmit={handleSubmit}>
                                        <br />
                                        <Form.Group className="mb-3" controlId="Provider">
                                            <Form.Label className="text-center">
                                                Whom was the internship provided by?
                                            </Form.Label>
                                            <Form.Control value={Provider} onChange={(e) => setProvider(e.target.value)} type="text" placeholder="i.e. Name of Company, Person, University, Institution etc." />
                                        </Form.Group>

                                        <div className='d-flex'>
                                            <Form.Group className="col md-4" controlId="FromDuration">
                                                <Form.Label className="text-center">
                                                    From
                                                </Form.Label>
                                                <Form.Control value={FromDuration} onChange={(e) => setFromDuration(e.target.value)} type="date" />
                                            </Form.Group>

                                            <Form.Group className="col-md-1" controlId="">
                                            </Form.Group>

                                            <Form.Group className="col md-4" controlId="ToDuration">
                                                <Form.Label className="text-center">
                                                    To
                                                </Form.Label>
                                                <Form.Control value={ToDuration} onChange={(e) => setToDuration(e.target.value)} type="date" />
                                            </Form.Group>
                                        </div>
                                        <br />

                                        <Form.Group className="mb-3" controlId="WhatFor">
                                            <Form.Label className="text-center">
                                                What was the internship about?
                                            </Form.Label>
                                            <Form.Control value={WhatFor} onChange={(e) => setWhatFor(e.target.value)} type="text" placeholder="ex. Creating an internship portal" />
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="Domain">
                                            <Form.Label className="text-center">
                                                What was the domain of the internship?
                                            </Form.Label>
                                            <Form.Control value={Domain} onChange={(e) => setDomain(e.target.value)} type="text" placeholder="ex. Web Development, IOT, etc." />
                                        </Form.Group>

                                        <div className="d-grid">
                                            <Button variant="primary" value="submitint" type="submit">
                                                Submit
                                            </Button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default CompletedinternshipForm;