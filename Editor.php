<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="viewport" content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <title>Games Collection</title>
    <link rel="stylesheet" href="style.css">
    
</head>
<body>
    <?php
    // Load game data from JSON file
    $games = json_decode(file_get_contents("games.json"), true);

    // Handle form submission
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Add new game
        if (!empty($_POST["add"])) {
            $newGame = array(
                "title" => $_POST["title"],
                "image" => $_POST["image"],
                "year" => $_POST["year"],
                "platform" => $_POST["platform"],
				"plot" => $_POST["plot"],
                "file" => $_POST["file"]
            );
            array_push($games, $newGame);
            file_put_contents("games.json", json_encode($games));
        }
        // Edit existing game
        elseif (!empty($_POST["edit"])) {
            $id = $_POST["id"];
            $games[$id]["title"] = $_POST["title"];
            $games[$id]["image"] = $_POST["image"];
            $games[$id]["year"] = $_POST["year"];
            $games[$id]["platform"] = $_POST["platform"];
            $games[$id]["plot"] = $_POST["plot"];
			$games[$id]["file"] = $_POST["file"];
            file_put_contents("games.json", json_encode($games));
        }
    }

    // Handle delete request
    if (!empty($_GET["delete"])) {
        $id = $_GET["delete"];
        unset($games[$id]);
        file_put_contents("games.json", json_encode($games));
    }

    // Display game collection
    echo "<table>";
    echo "<thead>";
    echo "<tr><th>Title</th><th>Image</th><th>Year</th><th>Platform</th><th>Plot</th><th>File</th><th>Actions</th></tr>";
    echo "</thead>";
    echo "<tbody>";
    foreach ($games as $id => $game) {
        echo "<tr>";
        echo "<td>" . $game["title"] . "</td>";
        echo "<td>" . $game["image"] . "</td>";
        echo "<td>" . $game["year"] . "</td>";
        echo "<td>" . $game["platform"] . "</td>";
        echo "<td>" . $game["plot"] . "</td>";
		echo "<td>" . $game["file"] . "</td>";
        echo "<td>";
        echo "<a href=\"?edit=$id\">Edit </a> ";
        echo "<a href=\"?delete=$id\">Delete</a>";
        echo "</td>";
        echo "</tr>";
    }
    echo "</tbody>";
    echo "</table>";

    // Display add/edit form
    if (!empty($_GET["edit"])) {
        $id = $_GET["edit"];
        $game = $games[$id];
    } else {
        $game = array(
            "title" => "",
            "image" => "",
            "year" => "",
            "platform" => "",
			"plot" => "",
            "file" => ""
        );
    }
    ?>
    <form method="POST">
        <input type="hidden" name="id" value="<?php echo $id ?>">
        <input type="hidden" name="<?php echo !empty($_GET['edit']) ? 'edit' : 'add'; ?>" value="1">
        
		<label for="title">Title:</label><br>
        <input type="text" id="title" name="title" value="<?php echo $game["title"] ?>"><br>

        <label for="image">Image:</label><br>
        <input type="text" id="image" name="image" value="<?php echo $game["image"] ?>"><br>

        <label for="year">Year:</label><br>
        <input type="text" id="year" name="year" value="<?php echo $game["year"] ?>"><br>

        <label for="platform">Platform:</label><br>
        <input type="text" id="platform" name="platform" value="<?php echo $game["platform"] ?>"><br>

        <label for="plot">Plot:</label><br>
        <input type="text" id="plot" name="plot" value="<?php echo $game["plot"] ?>"><br>
		
		<label for="file">File:</label><br>
        <input type="text" id="file" name="file" value="<?php echo $game["file"] ?>"><br>

        <button type="submit">Save</button>
    </form>
</body>
</html>
