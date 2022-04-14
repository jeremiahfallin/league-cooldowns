import { useState } from "react";
import Image from "next/image";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  Select,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";

export default function Cooldowns(props) {
  const [champs, setChamps] = useState(
    props.data.allChamps.sort((a, b) => a.name.localeCompare(b.name))
  );
  const [championNames, setChampionNames] = useState(
    props.data.allChamps.map((champ) => champ.name).flat()
  );
  const [championAbilityLevels, setChampionAbilityLevels] = useState([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);
  const [abilityHaste, setAbilityHaste] = useState(0);
  const [bonusAttackSpeed, setBonusAttackSpeed] = useState(0);
  const [activeChampion, setActiveChampion] = useState(
    props.data.allChamps[0].name
  );

  const calculateCooldown = ({
    baseCooldown,
    isYasuoQ,
    isYoneQ,
    isYoneW,
    isZeriQ,
    details,
  }) => {
    if (isYasuoQ) {
      return (
        baseCooldown * (1 - (0.01 * Math.max(bonusAttackSpeed, 111.1)) / 0.0167)
      );
    } else if (isYoneQ) {
      return (
        baseCooldown * (1 - (0.01 * Math.max(bonusAttackSpeed, 111.1)) / 0.0167)
      );
    } else if (isYoneW) {
      return (
        baseCooldown * (1 - (0.01 * Math.max(bonusAttackSpeed, 105)) / 0.0168)
      );
    } else if (isZeriQ) {
      return Math.max(
        baseCooldown /
          (details.stats.attackSpeed.flat +
            (details.stats.attackSpeedRatio.flat * bonusAttackSpeed) / 100),
        1 / 3
      );
    } else if (!abilityHaste) {
      return baseCooldown;
    }
    return baseCooldown * (100 / (100 + parseInt(abilityHaste)));
  };

  return (
    <Grid gap={4}>
      <Select
        placeholder="Select a champion"
        onChange={(e) => {
          setActiveChampion(e.target.value);
        }}
      >
        {championNames.map((championName, index) => (
          <option key={index} value={championName}>
            {championName}
          </option>
        ))}
      </Select>
      <Grid alignItems={"center"} templateColumns={`200px auto`} rowGap={4}>
        <Box>Ability Haste</Box>
        <Input
          type="number"
          min={0}
          max={500}
          value={abilityHaste}
          onChange={(e) => setAbilityHaste(e.target.value)}
        />

        <Box>Bonus Attack Speed</Box>
        <Input
          type="number"
          min={0}
          max={112}
          value={bonusAttackSpeed}
          onChange={(e) => setBonusAttackSpeed(e.target.value)}
        />
      </Grid>

      {champs.map((champion) => {
        const name = champion.name;
        const details = champion;
        if (name !== activeChampion) return null;
        return (
          <Grid key={champion.id} gap={4}>
            <Heading as="h3" justifySelf="center">
              {name}
            </Heading>
            <Box justifySelf="center">
              <Image
                src={champion.icon}
                alt={name}
                width="100px"
                height="100px"
              />
            </Box>
            <Text
              textTransform={"uppercase"}
              fontWeight={900}
              justifySelf="center"
            >
              {details.title}
            </Text>
            <Grid
              gridTemplateColumns={`repeat(4, 1fr)`}
              gridTemplateRows={`repeat(2, 1fr)`}
              alignItems="center"
              justifyContent={"space-around"}
            >
              {Object.keys(details.abilities).map((spell, index) => {
                if (spell === "P") return null;
                const abilities = details.abilities[spell];

                return abilities.map((ability, i) => {
                  return (
                    <Grid
                      key={ability.name}
                      alignSelf="center"
                      alignContent="center"
                      alignItems="center"
                      justifyContent={"center"}
                      justifyItems={"center"}
                      justifySelf={"center"}
                      gap={4}
                      gridRowStart={i + 1}
                    >
                      <Image
                        src={ability.icon}
                        alt={ability.name}
                        width="50px"
                        height="50px"
                      />
                      <Text>{details.abilities[spell].name}</Text>
                      <Slider
                        aria-label={`slider-spell-${details.abilities[spell].name}`}
                        onChange={(val) => {
                          const newChampionAbilityLevels =
                            championAbilityLevels.slice();
                          newChampionAbilityLevels[i][index] = val;
                          setChampionAbilityLevels(newChampionAbilityLevels);
                        }}
                        defaultValue={0}
                        min={0}
                        max={ability.cooldown.modifiers[0].values.length - 1}
                        step={1}
                      >
                        {ability.cooldown.modifiers[0].values.map(
                          (_, index) => {
                            return (
                              <SliderMark
                                key={index}
                                value={index}
                                label={`${index}`}
                                pt={2}
                              >
                                {index + 1}
                              </SliderMark>
                            );
                          }
                        )}

                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                      <Text pt={4}>
                        Cooldown:{" "}
                        {calculateCooldown({
                          baseCooldown:
                            ability.cooldown.modifiers[0].values[
                              championAbilityLevels[i][index]
                            ],
                          isYasuoQ: details.name === "Yasuo" && spell === "Q",
                          isYoneQ: details.name === "Yone" && spell === "Q",
                          isYoneW: details.name === "Yone" && spell === "W",
                          isZeriQ: details.name === "Zeri" && spell === "Q",
                          details,
                        }).toFixed(2)}
                        s
                      </Text>
                    </Grid>
                  );
                });
              })}
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
}
