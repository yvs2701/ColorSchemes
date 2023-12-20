# ColorSchemes
The primary objective of our project is to provide a convenient SaaS where users can generate a theme for their UX purposes. The project targets designers and creative people. We want fashion designers, user experience developers, event planners, product innovators and social media creators to use our website and are able to reproduce colors and themes that they envision in their heads.\
The website provides the frontend interface for users to upload an image which can be a brand logo, the view from their apartment, cloth accessories, or a random photograph. The server will then process the image and extract colors which make it up. Then we artistically generate a theme of four to six color swatches, and relay it back to the user.

Users will also get font and color recommendations for software experience aspects, and generative AI will be used to present the mockup of a room and a web layout where the suggested theme is applied for better visualization.

## Installation
To install the project, follow these steps:
1. Clone the git repository
```bash
git clone https://github.com/yvs2701/ColorSchemes.git
```

2. Install dependencies with pip
```bash
pip install -r requirements.txt
```

3. Install the dependencies for the frontend
```bash
cd frontend
npm install
```

3. Run the Flask server
```bash
python -m flask --app server run
```

4. Run the frontend
```bash
cd frontend
npm run dev
```
