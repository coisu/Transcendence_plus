from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

class Tournament(models.Model):
    tournament_id = models.AutoField(primary_key=True)
    tournament_name = models.CharField(max_length=255, unique=True)
    game_type = models.ForeignKey('GameType', on_delete=models.PROTECT, null=False, to_field='type_id', default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    nbr_of_player = models.IntegerField(default=2, 
        validators=[MinValueValidator(2), 
        MaxValueValidator(8)
        ]
    )
    tournament_type = models.ForeignKey('TournamentType', on_delete=models.PROTECT, null=False, to_field='type_id', default=1)
    registration = models.ForeignKey('RegistrationType', on_delete=models.PROTECT, null=False, to_field='type_id', default=1)
    setting = models.ForeignKey('MatchSetting', on_delete=models.PROTECT, null=False, to_field='setting_id', default=0)
    registration_period_min = models.IntegerField(default=15, 
        validators=[MinValueValidator(1, message="Registration period must be at least 1 minutes."), 
        MaxValueValidator(60, message="Registration period cannot exceed 60 minutes.")
        ]
    )
    host = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tournaments')

class TournamentMatch(models.Model):
    match_id = models.AutoField(primary_key=True)
    tournament_id = models.ForeignKey('Tournament', on_delete=models.CASCADE, related_name='match' )
    round_number = models.IntegerField()
    match_time = models.DateTimeField(null=True) 
    match_result = models.CharField(max_length=255)

class MatchSetting(models.Model):
    setting_id = models.AutoField(primary_key=True)
    duration_sec = models.IntegerField(default=210, 
        validators=[MinValueValidator(60, message="Duration must be at least 60 seconds."), 
        MaxValueValidator(300, message="Duration cannot exceed 300 seconds.")
        ]
    )
    max_score = models.IntegerField(default=5, 
        validators=[MinValueValidator(1, message="Max score must be at least 1."), 
        MaxValueValidator(10, message="Max score cannot exceed 10.")
        ]
    )
    walls_factor = models.IntegerField(default=0,
        validators=[MinValueValidator(0, message="Walls factor must be at least 0."), 
        MaxValueValidator(2, message="Walls factor cannot exceed 2.")
        ]
    )
    size_of_goals = models.IntegerField(default=15, 
        validators=[MinValueValidator(15, message="Size of goal must be at least 10."),
        MaxValueValidator(30, message="Size of goal cannot exceed 30.")
        ]
    )
    paddle_height = models.IntegerField(default=10, 
        validators=[MinValueValidator(1, message="Paddle height must be at least 1."),
        MaxValueValidator(12, message="Paddle height cannot exceed 12.")
        ]
    )
    paddle_speed = models.DecimalField(
        max_digits=3, decimal_places=2, default=0.5, 
        validators=[MinValueValidator(0.1, message="Paddle speed must be at least 0.1."),
        MaxValueValidator(2, message="Paddle speed cannot exceed 2.")
        ]
    )
    ball_speed = models.DecimalField(
        max_digits=3, decimal_places=2, default=0.7, 
        validators=[MinValueValidator(0.1, message="Ball speed must be at least 0.1."),
        MaxValueValidator(2, message="Ball speed cannot exceed 2.")
        ]
    )
    ball_radius = models.DecimalField(
        max_digits=3, decimal_places=2, default=1, 
        validators=[MinValueValidator(0.5, message="Ball radius must be at least 0.5."),
        MaxValueValidator(7, message="Ball radius cannot exceed 7.")
        ]
    )
    ball_color = models.CharField(max_length=7, default='#000000', 
    validators=[RegexValidator(r'^#(?:[0-9a-fA-F]{3}){1,2}$', message="Invalid color format.")])

class GameType(models.Model):
    type_id = models.AutoField(primary_key=True)
    type_name = models.CharField(max_length=255)

class TournamentType(models.Model):
    type_id = models.AutoField(primary_key=True)
    type_name = models.CharField(max_length=255)

class RegistrationType(models.Model):
    type_id = models.AutoField(primary_key=True)
    type_name = models.CharField(max_length=255)

class TournamentPlayer(models.Model):
    tournament_id = models.ForeignKey('Tournament', on_delete=models.CASCADE, related_name='tournament')
    player = models.ForeignKey('Player', on_delete=models.CASCADE, related_name='player')

    class Meta:
        unique_together = ('tournament_id', 'player')

class Player(models.Model):
    player_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=255)

    class Meta:
        unique_together = ('player_id', 'username')

class MatchParticipants(models.Model):
    match_id = models.ForeignKey('TournamentMatch', on_delete=models.CASCADE, related_name='participants')
    player_id = models.ForeignKey('Player', on_delete=models.CASCADE, related_name='playeridfrommatch')
    is_winner = models.BooleanField(default=False)
    participant_score = models.IntegerField(default=0)
