<?php

if (isset($_POST['type'])) {
    $TYPE = $_POST['type'];
}

if ($TYPE == 'newIdFolder') {

    if (isset($_POST['userId'])) {
        $userId = $_POST['userId'];
    }

    $json_content = file_get_contents('../api/todo.json');
    $json_decoded = json_decode($json_content, true);
    
    $json_decoded['todo'][$userId] = [];
    
    $json = json_encode($json_decoded, JSON_UNESCAPED_UNICODE);
    
    file_put_contents('../api/todo.json', $json);
    
} else if ($TYPE == 'newTodo') {

    if (isset($_POST['userId'])) {
        $userId = $_POST['userId'];
    }

    if (isset($_POST['todoId'])) {
        $todoId = $_POST['todoId'];
    }
    
    if (isset($_POST['day'])) {
        $todoDay = $_POST['day'];
    }
    
    if (isset($_POST['start'])) {
        $todoStart = $_POST['start'];
    }
    
    if (isset($_POST['end'])) {
        $todoEnd = $_POST['end'];
    }
    
    if (isset($_POST['description'])) {
        $todoDesc = $_POST['description'];
    }
    
    if (isset($_POST['todoType'])) {
        $todoType = $_POST['todoType'];
    }
    
    $new_item = [
        'id' => $todoId,
        'day' => $todoDay,
        'startTime' => $todoStart,
        'endTime' => $todoEnd,
        'description' => $todoDesc,
        'type' => $todoType,
        'checked' => '0'
    ];
    
    $json_content = file_get_contents('../api/todo.json');
    $json_decoded = json_decode($json_content, true);
    
    $json_decoded['todo'][$userId][] = $new_item;
    
    $json = json_encode($json_decoded, JSON_UNESCAPED_UNICODE);
    
    file_put_contents('../api/todo.json', $json);
    
    // echo 'Дело добавлено успешно!';

} else if ($TYPE == 'checkTodo') {
    
    if (isset($_POST['userId'])) {
        $userId = $_POST['userId'];
    }

    if (isset($_POST['todoId'])) {
        $todoId = $_POST['todoId'];
    }

    if (isset($_POST['checked'])) {
        $checked = $_POST['checked'];
    }

    $json_content = file_get_contents('../api/todo.json');
    $json_decoded = json_decode($json_content, true);
    
    for ($i = 0; $i < count($json_decoded['todo'][$userId]); $i++) {
        $item = $json_decoded['todo'][$userId][$i];

        if ($item['id'] == $todoId) {
            $json_decoded['todo'][$userId][$i]['checked'] = $checked;
        }
    }
    
    $json = json_encode($json_decoded, JSON_UNESCAPED_UNICODE);
    
    file_put_contents('../api/todo.json', $json);

} else if ($TYPE == 'deleteTodo') {
    
    if (isset($_POST['userId'])) {
        $userId = $_POST['userId'];
    }

    if (isset($_POST['todoId'])) {
        $todoId = $_POST['todoId'];
    }

    $json_content = file_get_contents('../api/todo.json');
    $json_decoded = json_decode($json_content, true);
    
    for ($i = 0; $i < count($json_decoded['todo'][$userId]); $i++) {
        $item = $json_decoded['todo'][$userId][$i];

        if ($item['id'] == $todoId) {
            unset($json_decoded['todo'][$userId][$i]);
            $json_decoded['todo'][$userId] = array_values($json_decoded['todo'][$userId]);
        }
    }
    
    $json = json_encode($json_decoded, JSON_UNESCAPED_UNICODE);
    
    file_put_contents('../api/todo.json', $json);

} else if ($TYPE == 'editTodo') {

    if (isset($_POST['userId'])) {
        $userId = $_POST['userId'];
    }

    if (isset($_POST['todoId'])) {
        $todoId = $_POST['todoId'];
    }
    
    if (isset($_POST['editedDay'])) {
        $todoEditedDay = $_POST['editedDay'];
    }
    
    if (isset($_POST['editedStart'])) {
        $todoEditedStart = $_POST['editedStart'];
    }
    
    if (isset($_POST['editedEnd'])) {
        $todoEditedEnd = $_POST['editedEnd'];
    }
    
    if (isset($_POST['editedDescription'])) {
        $todoEditedDesc = $_POST['editedDescription'];
    }
    
    if (isset($_POST['editedTodoType'])) {
        $todoEditedType = $_POST['editedTodoType'];
    }
    
    $json_content = file_get_contents('../api/todo.json');
    $json_decoded = json_decode($json_content, true);
    
    for ($i = 0; $i < count($json_decoded['todo'][$userId]); $i++) {
        $item = $json_decoded['todo'][$userId][$i];

        if ($item['id'] == $todoId) {
            $json_decoded['todo'][$userId][$i]['day'] = $todoEditedDay;
            $json_decoded['todo'][$userId][$i]['startTime'] = $todoEditedStart;
            $json_decoded['todo'][$userId][$i]['endTime'] = $todoEditedEnd;
            $json_decoded['todo'][$userId][$i]['description'] = $todoEditedDesc;
            $json_decoded['todo'][$userId][$i]['type'] = $todoEditedType;
        }
    }
    
    $json = json_encode($json_decoded, JSON_UNESCAPED_UNICODE);
    
    file_put_contents('../api/todo.json', $json);

} else if ($TYPE == 'deleteAll') {
    
    if (isset($_POST['userId'])) {
        $userId = $_POST['userId'];
    }

    $json_content = file_get_contents('../api/todo.json');
    $json_decoded = json_decode($json_content, true);
    
    unset($json_decoded['todo'][$userId]);
    
    $json = json_encode($json_decoded, JSON_UNESCAPED_UNICODE);
    file_put_contents('../api/todo.json', $json);
}

?>