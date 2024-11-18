from flask import Flask, render_template, request, redirect, url_for, session
from deepface import DeepFace
import os
import cv2
import gridfs 

from werkzeug.utils import secure_filename

import pymongo  # Add MongoDB support

# MongoDB configuration
client = pymongo.MongoClient("mongodb://localhost:27017/")  # Adjust this to your MongoDB URI
db = client["Flask"]  # Create or access the database
users_collection = db["users"]  # Create or access the collection for users
fs = gridfs.GridFS(db)  # Create a GridFS object for file storage

from graphviz import render
import cv2

app = Flask(__name__)
app.secret_key = 'votre_cle_secrete'  # Changez ceci pour une clé plus sécurisée

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/product')
def product():
    return render_template('product.html')

@app.route('/prudutsDetails')   
def productsDetails():
    return render_template('productDetails.html')


@app.route('/authenticate', methods=['POST'])
def authenticate():
    # Récupérer les données du formulaire
    name = request.form['name']
    email = request.form['email']
    password = request.form['password']
    user_image = request.files['userImage']
    id_card_image = request.files['idCardImage']

    # Enregistrer les images dans GridFS
    user_image_filename = secure_filename(user_image.filename)
    id_card_image_filename = secure_filename(id_card_image.filename)

    user_image_id = fs.put(user_image.read(), filename=user_image_filename)
    id_card_image_id = fs.put(id_card_image.read(), filename=id_card_image_filename)

    # Sauvegarder temporairement les images pour la vérification
    user_image_path = os.path.join('uploads', 'user_image.jpg')
    id_card_image_path = os.path.join('uploads', 'id_card_image.jpg')
    
    # Lire les images en utilisant OpenCV
    with open(user_image_path, 'wb') as f:
        f.write(fs.get(user_image_id).read())
    
    with open(id_card_image_path, 'wb') as f:
        f.write(fs.get(id_card_image_id).read())

    def extract_face(image_path):
        # Charger l'image
        image = cv2.imread(image_path)
        if image is None:
            raise Exception("Image introuvable ou illisible")
        
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

        # Détecter les visages
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        if len(faces) > 0:
            (x, y, w, h) = faces[0]
            face = image[y:y+h, x:x+w]
            face_path = os.path.join('uploads', 'extracted_face.jpg')
            cv2.imwrite(face_path, face)
            return face_path
        else:
            raise Exception("Aucun visage détecté dans l'image de la carte d'identité")

    # Extraire le visage de la carte d'identité
    extracted_face_path = extract_face(id_card_image_path)

    try:
        # Comparer les images avec DeepFace
        result = DeepFace.verify(user_image_path, extracted_face_path)

        # Supprimer les images après vérification
        os.remove(user_image_path)
        os.remove(id_card_image_path)

        if result['verified']:
            session['authenticated'] = True

            # Enregistrer les données de l'utilisateur dans MongoDB
            user_data = {
                "name": name,
                "email": email,
                "password": password,  # Note : hachez le mot de passe dans une vraie application
                "user_image_id": user_image_id,
                "id_card_image_id": id_card_image_id
            }
            users_collection.insert_one(user_data)
            return redirect(url_for('dashboard'))
        else:
            return render_template('login.html', error="Les images ne correspondent pas")

    except Exception as e:
        return str(e), 500


@app.route('/dashboard')
def dashboard():
    if 'authenticated' in session:
        return render_template('dashboard.html')
    else:
        return redirect(url_for('index'))

@app.route('/login')
def login():
    return render_template('login.html')
   



if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    app.run(debug=True)
    
