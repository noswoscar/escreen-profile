curl -X POST http://localhost:3100/api/entity   -H "Content-Type: application/json"   -d '{
    "name": "John Doe",
    "age": 25,
    "isActive": true,
    "preferences": {
      "color": "blue",
      "size": "M"
    },
    "tags": ["new", "important"],
    "relatedUser": "60c72b2f5b8c223e14e5f8b6"
  }'

  curl -X DELETE http://localhost:3100/api/entity/67eeb9d3eeb94aa0c2b82814  -H "Content-Type: application/json"