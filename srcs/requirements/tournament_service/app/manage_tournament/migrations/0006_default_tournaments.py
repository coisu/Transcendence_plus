# Generated by Django 5.0.3 on 2024-03-31 13:29
import django.core.validators
import random
from django.db import migrations, models
from django.utils import timezone
from manage_tournament.models import Tournament, MatchSetting

def create_random_game_setting(account_id):
    game_setting = {
        "nbr_of_player": random.randint(2, 8),
        "max_score": random.randint(1, 10),
        "duration_sec": random.randint(1, 99),
        "walls_factor": round(random.uniform(0, 2), 2),
        "size_of_goals": random.randint(15, 30),
        "paddle_height": random.randint(1, 12),
        "paddle_speed": round(random.uniform(0.1, 3), 2),
        "ball_speed": round(random.uniform(0.1, 3), 2),
        "ball_radius": round(random.uniform(0.5, 7), 2),
        "ball_color": "#00ffff",
    }

    return game_setting


def create_tournament(apps, schema_editor):
    Player = apps.get_model('manage_tournament', 'Player')
    MatchSetting = apps.get_model('manage_tournament', 'MatchSetting')
    Tournament = apps.get_model('manage_tournament', 'Tournament')

    players = ['motero', 'amanda', 'jisu', 'znogueira', 'yoel', 'motero2', 'amanda2', 'jisu2', 'znogueira2', 'yoel2']
    for i, player_username in enumerate(players):
        #create player or get it if it already exists
        host_player, _ = Player.objects.get_or_create(id=i, username=player_username, defaults={'total_played': 0})

        #generate random game setting
        game_setting = create_random_game_setting(host_player.id)
        match_setting = MatchSetting.objects.create(**game_setting)

        #create tournament
        tournament = Tournament.objects.create(
            tournament_name=f'TEST_{i+1}',
            nbr_of_player_total=game_setting['nbr_of_player'],
            nbr_of_player_match=game_setting['nbr_of_player'],
            setting=match_setting,
            registration_period_min=random.randint(5, 60),
            host=host_player,
        )

        #add host player to the tournament
        tournament.players.add(host_player)
        print(f'Tournament {tournament.tournament_name} created with host player {host_player.username}')

class Migration(migrations.Migration):

    dependencies = [
        ('manage_tournament', '0005_remove_tournamentmatch_participants_and_more'),
    ]

    operations = [
        migrations.RunPython(create_tournament),
    ]