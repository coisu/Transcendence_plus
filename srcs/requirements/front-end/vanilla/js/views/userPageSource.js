
export default `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ data.username }}'s profile</title>
    <script src="https://code.jquery.com/jquery-3.6.4.min.js"></script>
</head>
<body>
    <h1>{{ data.username }}'s profile</h1>

    <p>Username: {{ data.username }}</p>
    {% if data.avatar %}
        <p><img src="{{ data.avatar }}" alt="Avatar" width="30" height="30"></p>
    {% else %}
        <p>No avatar available</p>
    {% endif %}
    <p>Email: {{ data.email }}</p>
    <p>Playername: {{ data.playername }}</p>

    <p>Friends: <a href="{% url 'account:friend' %}" style="text-decoration: underline; color: blue; font-size: 14px;">{{ data.friends_count }}</a></p>

    <h2>GameStats</h2>
    <p>Game Player: {{ data.game_stats.user }}</p>
    <p>Total Games Played: {{ data.game_stats.total_games_played }}</p>
    <p>Games Won: {{ data.game_stats.games_won }}</p>
    <p>Games Lost: {{ data.game_stats.games_lost }}</p>

    <a href="{% url 'account:profile_update' %}" style="text-decoration: underline; color: blue; font-size: 14px;">Update Profile</a>
    <p>
    <a href="#" id="deleteAccountLink" style="text-decoration: underline; color: red; font-size: 14px;">Delete Account</a>
    <p></p>
    <button type="button" onclick="redirectToGameStatsPage()">GAME STATS TEST</button>

    <div id="deleteAccountModal" style="display: none;">
        <p>If you delete your account, all of your data will be deleted permanently.</p>
        <p>Are you sure you want to delete your pong account?</p>
        <button onclick="confirmDeleteAccount()">Yes, I'm sure</button>
        <button onclick="cancelDeleteAccount()">No, I'll keep my account</button>
    </div>

    <div id="deleteConfirmationModal" style="display: none;">
        <p>Your account has been deleted successfully.</p>
        <p>Thank you for being part of our community.</p>
        <button onclick="redirectToHome()">Go to Home</button>
    </div>

    <script>
        function redirectToGameStatsPage() {
            const username = "{{ data.username }}";
            window.location.href = '../gameHistory_microservice/api/game-stats/${username}/';
        }

        document.getElementById('deleteAccountLink').addEventListener('click', function() {
            document.getElementById('deleteAccountModal').style.display = 'block';
        });

        function getCookie(name) {
            var cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i].trim();
                    // Does this cookie string begin with the name we want?
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

        function confirmDeleteAccount() {
            document.getElementById('deleteAccountModal').style.display = 'none';

            $.ajax({
                type: 'POST',
                url: '{% url "account:delete_account" %}',
                headers: { "X-CSRFToken": getCookie('csrftoken') },
                success: function (data) {
                    if (data.success) {
                        console.log('Print all user data successful:', data);
                        document.getElementById('deleteConfirmationModal').style.display = 'block';
                    } else {
                        console.error('Error deleting account:', data.error);
                    }
                },
                error: function (error) {
                    console.error('Error deleting account:', error);
                }
            });
        }

        function cancelDeleteAccount() {
            document.getElementById('deleteAccountModal').style.display = 'none';
        }

        function redirectToHome() {
            window.location.href = '{% url "home" %}';
        }
    </script>
</body>
</html>
`;
