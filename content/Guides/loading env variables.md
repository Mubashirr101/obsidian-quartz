```python
import os
from dotenv import load_dotenv

# Load the .env file into os.environ
load_dotenv()

# Access the variables
secret_key = os.getenv("SECRET_KEY")
db_url = os.environ.get("DATABASE_URL")

print(secret_key)

```