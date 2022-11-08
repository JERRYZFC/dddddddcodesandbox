import React from "react";
import Row from "./Row";

class Greet extends React.Component {
  state = {
    name: "Deadpoolz"
  };

  constructor(props) {
    super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
  }

  // componentDidMount() {
  //   document.title = `Greet ${this.state.name}`;
  // }

  // componentDidUpdate() {
  //   document.title = `Greet ${this.state.name}`;
  // }

  handleNameChange(ev) {
    this.setState({
      name: ev.target.value
    });
  }

  render() {
    const { state, handleNameChange } = this;
    const { name } = state;

    return (
      <React.Fragment>
        <Row label="Greetings">
          <input value={name} onChange={handleNameChange} />
        </Row>
      </React.Fragment>
    );
  }
}

export default Greet;
