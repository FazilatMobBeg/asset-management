from flask import Flask, request, jsonify
from PIL import Image
import io
import boto3
import pandas as pd
from trp import Document
from flask_cors import CORS
from flask_pymongo import PyMongo

app = Flask(__name__)
CORS(app)

app.config['MONGO_URI'] = 'mongodb://localhost:27017/textract-invoices'
mongo = PyMongo(app)

client = boto3.client('textract')


@app.route('/process_image', methods=['POST'])
def process_image():
    # Get the department value from the request
    department = request.form.get('department')

    # Check if the 'image' key exists in the request files
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided.'}), 400

    image_file = request.files['image']

    # Perform image processing or any desired operations based on the department value
    buffered = io.BytesIO(image_file.read())

    response = client.analyze_expense(
        Document={'Bytes': buffered.getvalue()}
    )

    def extract_lineitem(lineitemgroups, client):
        items, price, qty = [], [], []
        t_items, t_price, t_qty = None, None, None

        for lines in lineitemgroups:
            for item in lines['LineItems']:
                for line in item['LineItemExpenseFields']:
                    if line.get('Type').get('Text') == 'ITEM':
                        t_items = line.get("ValueDetection").get("Text", "")

                    if line.get('Type').get('Text') == "UNIT_PRICE":
                        t_price = line.get("ValueDetection").get("Text", "")

                    if line.get('Type').get('Text') == "QUANTITY":
                        t_qty = line.get("ValueDetection").get("Text", "")

                if t_items:
                    items.append(t_items)
                else:
                    items.append("")
                if t_price:
                    price.append(t_price)
                else:
                    price.append("")
                if t_qty:
                    qty.append(t_qty)
                else:
                    qty.append("")

                t_items, t_price, t_qty = None, None, None

        df = pd.DataFrame()
        df["items"] = items
        df["unit_price"] = price
        df["quantity"] = qty

        return df

    for i in response['ExpenseDocuments']:
        df = extract_lineitem(i['LineItemGroups'], client)

    response = client.analyze_document(
        Document={'Bytes': buffered.getvalue()},
        FeatureTypes=['FORMS']
    )

    doc = Document(response)
    output_dict = {}

    for page in doc.pages:
        for field in page.form.fields:
            output_dict[str(field.key)] = str(field.value)

    dictt = {}

    key0 = "Invoice Number" or "Tax invoice no"
    fields = page.form.searchFieldsByKey(key0)
    for field in fields:
        value = field.value.text if field.value is not None else None
        dictt[key0] = value

    key1 = "Invoice Date"
    fields = page.form.searchFieldsByKey(key1)
    for field in fields:
        value = field.value.text if field.value is not None else None
        dictt[key1] = value

    key2 = "Invoice Value"
    fields = page.form.searchFieldsByKey(key2)
    for field in fields:
        value = field.value.text if field.value is not None else None
        dictt[key2] = value

    key3 = "Date"
    fields = page.form.searchFieldsByKey(key3)
    for field in fields:
        value = field.value.text if field.value is not None else None
        dictt[key3] = value

    key4 = "Total Amount"
    fields = page.form.searchFieldsByKey(key4)
    for field in fields:
        value = field.value.text if field.value is not None else None
        dictt[key4] = value

    key5 = "Tax invoice no"
    fields = page.form.searchFieldsByKey(key5)
    for field in fields:
        value = field.value.text if field.value is not None else None
        dictt[key5] = value

    output_dict.update(dictt)
    output_dict.update({'Department': department})

    return jsonify(output_dict)


@app.route('/add_data', methods=['POST'])
def add_data():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided.'}), 400

    collection = mongo.db.textractI
    inserted_data = collection.insert_one(data)

    return jsonify({'message': 'Data added successfully.', 'inserted_id': str(inserted_data.inserted_id)})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)
