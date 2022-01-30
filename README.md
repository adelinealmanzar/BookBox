# BookBox

Basic story of application:
- This app will provide book reviews and allow users to write reviews

Purpose of project:
To complete a Flatiron School Phase 1 project that met the following requirements:
- html/css/js frontend that communicates to an api
- single app
- at least 3 separate event listeners (DOMContentLoaded, click, change, submit, etc)
- interactivity (like button, adding comments); doesn’t need to persist after loading the page
- good coding practices (no repeated code using fns)

User will be able to:
- view the bookclub book of the month when the page initially loads
- to click a previous bookclub book and see its details displayed on the page
- leave a review
- leave a numeric star rating
- delete any review and edit rating
- see an error message if the rating data they introduced is in incorrect format
- (Stretch) filter book list
- (Stretch) if user adds a review, they can remove or edit only that review

Challenges faced:
- learning css
- deleting user reviews
- editing user reviews

Future implementation:
- optimize user experience during review submital
- optimize user experience during editing



## Installation
Use json server to create an api call using the db.json file provided
```bash
json-server --watch db.json
```

## Usage
In webpage:
- initially loading the page should display the top book's information
- clicking a book on the left book list should display the book's information
- submiting form should result in review appearing in bottom review list
- double cliking a review comment should initally result in the comment deletion; and, then the comment should appear in the submit form input
- cliking the delete button should result in the deletion of the entire review
- average stars and calculations should automatically update based on any review-related event

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/1.11.8/semantic.min.css)
