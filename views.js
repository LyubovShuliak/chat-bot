const commentView = (txt) => ({
  private_metadata: txt,
  callback_id: "comment",
  title: {
    type: "plain_text",
    text: "Modal Title",
  },
  submit: {
    type: "plain_text",
    text: "Submit",
  },
  blocks: [
    {
      type: "input",
      element: {
        type: "plain_text_input",
        action_id: "ml_input",
        multiline: true,
        placeholder: {
          type: "plain_text",
          text: "Placeholder text for multi-line input",
        },
      },
      label: {
        type: "plain_text",
        text: "Add comment to issue " + txt,
      },
    },
  ],
  type: "modal",
});

module.exports = { commentView };
