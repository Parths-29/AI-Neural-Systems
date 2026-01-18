IPL Win Probability Predictor.
Introduction -
Hello! I'm Parth, and this is my first project as I begin my journey into the world of Machine Learning. As a beginner, I wanted to explore how data can be used to predict real-world outcomes in sports. Through this project, I aimed to understand the end-to-end process of building an ML application—from cleaning historical datasets to deploying a live web interface. My goal is to continue exploring more complex algorithms and deep learning concepts as I grow in this field.

Project Overview -
This project is a machine learning-based web application designed to predict the winning probability of an IPL match during the second innings. By analyzing real-time match data—such as runs needed, balls remaining, and wickets lost—the application provides a dynamic percentage chance of victory for both the batting and bowling teams.

Why this is useful???
Sports betting, broadcasting, and coaching staff use similar models to make data-driven decisions. For fans, it adds a layer of engagement by showing how much a single wicket or a big over actually shifts the momentum of a game.

Machine Learning Integration -
1. Classification Logic: In sports analytics, win prediction is treated as a "classification" problem.
2 The Model: The core engine is a Logistic Regression model, chosen for its ability to provide balanced probability scoring rather than just a hard "win/loss" output.
3. Training Data: The model was trained on historical ball-by-ball data from IPL matches spanning 2008 to 2019.
4. The Pipeline: We utilized a Scikit-Learn Pipeline to bundle data preprocessing (specifically OneHotEncoding for categorical features like teams and cities) directly with the model. This ensures that real-world user inputs are processed exactly like the training data.

Value Proposition -
1. Data-Driven Decisions: Similar models are utilized by broadcasting teams, coaching staff, and sports analysts to make informed, data-backed decisions.
2. Fan Engagement: For spectators, this adds a layer of engagement by visualizing how a single wicket or a high-scoring over shifts match momentum in real-time.

Technology Stack -
1. Language: Python
2. Web Framework: Streamlit
3. Data Processing: Pandas & NumPy
4. Machine Learning: Scikit-Learn (Logistic Regression)

Features -
1. Real-time Logic: Instant probability updates based on dynamic user input.
2. Venue Sensitivity: Accounts for the specific city/stadium factor where the match is held.
3. Modern UI: Features a clean, "glassmorphism" styled dashboard for an intuitive user experience.

Project Structure -
app.py: The main script that runs the Streamlit web interface and handles user inputs.
pipe.pkl: The saved "brain" of the project—a serialized version of the trained machine learning pipeline.
IPL Win Probability Predictor.ipynb: The Jupyter Notebook where I cleaned the data and trained the model.
matches.csv / deliveries.csv: Raw historical datasets used for training.
requirements.txt: A list of Python libraries needed to run this project.
img.webp: The custom background image used for the web UI.

How to Run Locally
1. Clone the repo: git clone <your-repo-link>
2. Install requirements: pip install -r requirements.txt
3. Start the app: streamlit run app.py

And also you can visit it on https://ipl-win-predictor-be6tyhrvdccfgcfwihxf8u.streamlit.app/
Hope you like this project! I am excited to keep learning and building more impactful data science tools.
