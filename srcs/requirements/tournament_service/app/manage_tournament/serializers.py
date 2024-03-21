from rest_framework import serializers
from .models import Tournament, TournamentMatch, MatchSetting, GameType, TournamentType
from .models import RegistrationType, TournamentPlayer, Player, MatchParticipants

class MatchSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchSetting
        fields = fields = '__all__'

class TournamentSerializer(serializers.ModelSerializer):
    setting = MatchSettingSerializer()
    # game_type = serializers.PrimaryKeyRelatedField(queryset=GameType.objects.all())  # Add this line
    # tournament_type = serializers.PrimaryKeyRelatedField(queryset=TournamentType.objects.all())  # Add this line
    # registration = serializers.PrimaryKeyRelatedField(queryset=RegistrationType.objects.all())  # Add this line
    is_full = serializers.SerializerMethodField()
    joined = serializers.SerializerMethodField()

    class Meta:
        model = Tournament
        fields = ['tournament_name', 'nbr_of_player_total', 'nbr_of_player_match', 'setting', 'game_type', 'tournament_type', 'registration', 'registration_period_min', 'host_id', 'joined', 'is_full' ]

    def create(self, validated_data):
        setting_data = validated_data.pop('setting')  # Extract data from MatchSetting
        setting = MatchSetting.objects.create(**setting_data)  # Create a new MatchSetting object
        tournament = Tournament.objects.create(setting=setting, **validated_data)  # Create a new Tournament object
        return tournament

    def update(self, instance, validated_data):
        setting_data = validated_data.pop('setting')
        setting = instance.setting

        instance.tournament_name = validated_data.get('tournament_name', instance.tournament_name)
        instance.nbr_of_player_total = validated_data.get('nbr_of_player_total', instance.nbr_of_player_total)
        instance.nbr_of_player_match = validated_data.get('nbr_of_player_match', instance.nbr_of_player_match)
        # instance.game_type = validated_data.get('game_type', instance.game_type)
        # instance.tournament_type = validated_data.get('tournament_type', instance.tournament_type)
        # instance.registration = validated_data.get('registration', instance.registration)
        instance.registration_period_min = validated_data.get('registration_period_min', instance.registration_period_min)
        instance.host_id = validated_data.get('host_id', instance.host_id)
        instance.save()

        # `MatchSetting` is a one-to-one relationship with `Tournament`
        for field, value in setting_data.items():
            setattr(setting, field, value)
        setting.save()

        return instance

    def get_joined(self, obj):
        return obj.players.count()

    def get_is_full(self, obj):
        return obj.is_full()

class TournamentRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentPlayer
        fields = ['tournament_id', 'player'] # Fields to be serialized

    def create(self, validated_data):
        # Create a new TournamentPlayer object
        tournament_player = TournamentPlayer.objects.create(**validated_data)
        return tournament_player

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id']

class MatchParticipantsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MatchParticipants
        fields = ['id', 'match_id', 'round_number', 'player_id', 'is_winner', 'participant_score']

class MatchGeneratorSerializer(serializers.Serializer):
    tournament_id = serializers.IntegerField()
    class Meta:
        model = Tournament
        fields = ['id']

    def create(self, validated_data):
        tournament_id = validated_data.get('tournament_id')
        return tournament_id

    def update(self, instance, validated_data):
        instance.tournament_id = validated_data.get('tournament_id', instance.tournament_id)
        return instance

# class GameTypeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = GameType
#         fields = ['id', 'type_name']

class TournamentMatchSerializer(serializers.ModelSerializer):
    players = PlayerSerializer(many=True)
    participants = MatchParticipantsSerializer(many=True)

    class Meta:
        model = TournamentMatch
        fields = ['id', 'state', 'tournament_id', 'round_number', 'match_time', 'players', 'participants']


# class TournamentTypeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = TournamentType
#         fields = ['id', 'type_name']

# class RegistrationTypeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = RegistrationType
#         fields = ['id', 'type_name']

class TournamentPlayerSerializer(serializers.ModelSerializer):
    # username = serializers.CharField()
    players = PlayerSerializer(many=True)
    class Meta:
        model = TournamentPlayer
        fields = ['tournament_id', 'players']
