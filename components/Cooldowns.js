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
  const [champs, setChamps] = useState(props.data.allChamps);
  const [championNames, setChampionNames] = useState(
    props.data.allChamps.map((champ) => Object.keys(champ.data)).flat()
  );
  const [championAbilityLevels, setChampionAbilityLevels] = useState([
    0, 0, 0, 0,
  ]);
  const [abilityHaste, setAbilityHaste] = useState(0);
  const [activeChampion, setActiveChampion] = useState(
    Object.keys(props.data.allChamps[0].data)[0]
  );

  return (
    <Grid gap={4}>
      <Select
        placeholder="Select a champion"
        onChange={(e) => {
          setActiveChampion(Object.keys(champs[e.target.value].data)[0]);
        }}
      >
        {championNames.map((championName, index) => (
          <option key={index} value={index}>
            {championName}
          </option>
        ))}
      </Select>
      <Flex align={"center"}>
        <Box>Ability Haste</Box>
        <Input
          type="number"
          value={abilityHaste}
          onChange={(e) => setAbilityHaste(e.target.value)}
        />
      </Flex>

      {champs.map((champion) => {
        const name = Object.keys(champion.data)[0];
        const details = champion.data[name];
        if (name !== activeChampion) return null;
        return (
          <Grid key={champion.data[name].key} gap={4}>
            <Heading as="h3" justifySelf="center">
              {name}
            </Heading>
            <Box justifySelf="center">
              <Image
                src={`http://ddragon.leagueoflegends.com/cdn/12.7.1/img/champion/${name}.png`}
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
              alignItems="center"
              justifyContent={"space-around"}
            >
              {details.spells.map((spell, index) => {
                return (
                  <Grid
                    key={spell.name}
                    alignSelf="center"
                    alignContent="center"
                    alignItems="center"
                    justifyContent={"center"}
                    justifyItems={"center"}
                    justifySelf={"center"}
                    gap={4}
                  >
                    <Image
                      src={`http://ddragon.leagueoflegends.com/cdn/12.7.1/img/spell/${spell.image.full}`}
                      alt={spell.name}
                      width="50px"
                      height="50px"
                    />
                    <Text>{spell.name}</Text>
                    <Slider
                      aria-label={`slider-spell-${spell.name}`}
                      onChange={(val) => {
                        const newChampionAbilityLevels =
                          championAbilityLevels.slice();
                        newChampionAbilityLevels[index] = val;
                        setChampionAbilityLevels(newChampionAbilityLevels);
                      }}
                      defaultValue={0}
                      min={0}
                      max={spell.cooldown.length - 1}
                      step={1}
                    >
                      {spell.cooldown.map((_, index) => {
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
                      })}

                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                    <Text pt={4}>
                      Cooldown:{" "}
                      {(
                        spell.cooldown[championAbilityLevels[index]] *
                        (100 / (100 + parseInt(abilityHaste)))
                      ).toFixed(2)}
                      s
                    </Text>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
}
