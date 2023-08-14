"use client";

import DashboardLayout from "@/layouts/dashboard";
import Card from "@/components/card";
import Stepper from "@/components/stepper";
import { useEffect, useState } from "react";
import Button from "@/components/button";
import searchsvg from "@/assets/search.svg";

import NewProjectContext from "@/context/new-project";
import { useRouter } from "next/navigation";
import { message } from "antd";
import * as api from "@/api";

import ServerError from "@/popups/server-error";
import ServerSuccess from "@/popups/server-success";
import Link from "next/link"

export default function NewProjectLayout({ children }) {
  const { push } = useRouter();

  const [final, setFinal] = useState(false);
  const [steps, setSteps] = useState([
    {
      label: "Add project details",
      slug: "",
    },
    // {
    //   label: "Team & Collaborators",
    //   slug: "step-2",
    // },
    {
      label: "Upload Document",
      slug: "step-3",
    },
    {
      label: "Edit Document",
      slug: "step-4",
    },
  ]);

  const [popup, setPopup] = useState({
    server_error: {
      visible: false,
      message: "",
    },
    server_success: {
      title: "Success",
      visible: false,
      message: "",
    },
  });

  const [project, setProject] = useState({
    name: "",
    leads: {},
    user: {},
    notes: "",
    duedate: "",
    reminderdate: "",
    content: "",
    ai_summary: "",
    team: "",
    members: [],
    external_collaborators: [],
    signatories: [],
    documentname: "",
    document: null,
    docContent: null,
    type: "",
    category: "",
    approvers: [],
    final_approver: {
      label: "Not selected",
      value: null,
    },
    save_for_future: false,
  });

  const [activeStep, setActiveStep] = useState("");

  const [aiSummaryData, setAiSummaryData] = useState([]);

  const onChangeActiveStep = (step) => {
    setActiveStep(step.slug);
    push("/new-project/" + step.slug);
  };

  const handlePrev = () => {
    const currentIndex = steps.findIndex((item) => item.slug == activeStep);
    const targetStep = steps[currentIndex - 1];
    setActiveStep(targetStep.slug);
    if (final) { setFinal(false) }
    if (currentIndex - 1 != 0) {
      push("/new-project/step-" + currentIndex);
    } else {
      push("/new-project");
    }
  };

  const handleNext = () => {
    // Check if the "role" value is null for any member
    let status = true;
    for (let i = 0; i < project.members.length; i++) {
      if (project.members[i].role.value === null || project.members[i].role.value === "") {
        setPopup({
          ...popup,
          server_error: {
            visible: true,
            message: `Please assign a role to <b>${project.members[i].name}</b> before continuing`,
          },
        });
        status = false;
      }
    }
    if (status) {
      const currentIndex = steps.findIndex((item) => item.slug == activeStep);
      const targetStep = steps[currentIndex + 1];

      if (final) {
        push("/active-projects");
        handleCreateProject();
      }

      // if (activeStep == 'step-3') {
      //   push("/active-projects");
      //   handleCreateProject();
      // }


      setFinal(false)
      if (targetStep == steps[steps.length - 1]) {
        setFinal(true)
        push("/new-project/edit-document");
        return;
      }

      if (currentIndex != steps.length - 1) {
        setActiveStep(targetStep.slug);
        push("/new-project/step-" + (currentIndex + 3));
      }
    }
  };

  const isCanPrev = () => {
    if (activeStep == steps[0].slug) {
      return false;
    }
    return true;
  };

  const isCanNext = () => {
    if (activeStep == steps[0].slug) {
      if (!project.name || !project.duedate) {
        return false;
      }
    }

    // if (activeStep == steps[1].slug) {
    //   // const existLead = !! Object.values(project.leads).filter(value => value).length
    //   // return existLead
    // }

    if (activeStep == steps[1].slug) {
      // if (!project.documentname || !project.type || !project.category) {
      //   return false;
      // }
    }

    return true;
  };

  const handleCreateProject = async () => {
    message.open({
      key: "analyzing",
      type: "loading",
      content: "Our super smart AI is simplifying your document! Hang Tight...we'll be done within a minute.",
      duration: 0,
    });

    setActiveStep("step-4");

    let promise = new Promise(async (resolve, reject) => {
      const fd = new FormData();
      fd.append("document", project.document);
      fd.append("documentname", project.documentname);
      fd.append("docContent", project.docContent);


      let content = await api.convert_file_to_html(fd).then((data) => {
        return new Promise((resolve, reject) => resolve(data.data));
      });

      let plainText = content;
      const tempElement = document.createElement("div");
      const bodyStart = plainText.indexOf("<body");
      if (bodyStart != null) {
        plainText = plainText.slice(content.indexOf("<body"), plainText.length);
      }

      plainText = plainText.replace(/\n/gi, " ").replace(/(<([^>]+)>)/gi, "");
      tempElement.innerHTML = plainText;

      const regexps = [/(<p\b[^>]*>).*?(<\/p>)/gis, /(<li\b[^>]*>)(.*?)(<\/li>)/gis];

      const htmlTagsRegex = /<\/?[^>]+(>|$)/g;
      const stripRegex = /^<[^>]+>|<\/[^>]+>$/g;
      const tableRegex = /(<p\b)(?:(?!<\/table>).)*?(<table\b.*?>)|<\/table.*?\/p>/gis;

      content = content.replace(/text-indent:.*?;/g, "");

      let noTables = content.match(tableRegex);

      if (!noTables) noTables = [content];

      let strippedTexts = [];
      let plainTexts = [];

      for (let index = 0; index < noTables.length; index++) {
        const noTable = noTables[index];
        const tempStrippedTexts = regexps.flatMap((regexp) => {
          const matches = noTable.match(regexp);
          const coreMatch = [];
          matches &&
            matches.forEach((mat) => {
              if (mat.match(/(<(span\b[^>]*)>((?!&#xa0;)(?!<).)*?<\/span>)/gis)) coreMatch.push(mat);
            });
          return coreMatch.map((match) => match.replace(stripRegex, ""));
        });

        strippedTexts = [...strippedTexts, ...tempStrippedTexts];
      }

      for (let index = 0; index < noTables.length; index++) {
        const noTable = noTables[index];
        const tempPlainTexts = regexps.flatMap((regexp) => {
          const matches = noTable.match(regexp);
          const coreMatch = [];
          matches &&
            matches.forEach((mat) => {
              if (mat.match(/(<(span\b[^>]*)>((?!&#xa0;)(?!<).)*?<\/span>)/gis)) coreMatch.push(mat);
            });
          return coreMatch.map((match) => match.replace(htmlTagsRegex, ""));
        });

        plainTexts = [...plainTexts, ...tempPlainTexts];
      }

      console.log("PLAN", plainTexts);
      console.log("STRIP", strippedTexts);

      let summaryHtml = content;

      for (let index = 0; index < plainTexts.length; index++) {
        const item = plainTexts[index];
        const old = strippedTexts[index];

        // Check if the current index is a multiple of 50
        if ((index + 1) % 50 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        await api
          .openAI_summarize_document({
            content: item,
          })
          .then((data) => {
            function escapeRegExp(string) {
              return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            }
            summaryHtml = summaryHtml.replace(
              new RegExp(escapeRegExp(old), "g"),
              data?.data?.choices.map((res) => res.text).join("")
            );
          });
      }

      await api
        .openAI_summarize_document({
          content: "Agreement Document",
        })
        .then((data) => {
          project.ai_summary = data?.data?.choices.map((item) => item.text).join("");
          project.content = content;
          project.summaryhtml = summaryHtml;

          setPopup({
            ...popup,
            server_success: {
              title: "Success",
              visible: false,
              message: "",
            },
          });

          console.log("total", project);

          const fd = new FormData();
          for (let key in project) {
            fd.append(key, project[key]);
          }

          fd.set("final_approver", JSON.stringify(project.final_approver));
          if (project.team) {
            fd.set("team", JSON.stringify(project.team));
          }

          // fd.set("members", JSON.stringify(project.members));
          // fd.set("external_collaborators", JSON.stringify(project.external_collaborators));
          // fd.set("signatories", JSON.stringify(project.signatories));
          // fd.set("approvers", JSON.stringify(project.approvers));

          project.approvers.forEach((member) => {
            fd.append("approvers[]", JSON.stringify(member));
          });

          project.members.forEach((member) => {
            fd.append("members[]", JSON.stringify(member));
          });

          project.external_collaborators.forEach((member) => {
            fd.append("external_collaborators[]", JSON.stringify(member));
          });

          project.signatories.forEach((member) => {
            fd.append("signatories[]", JSON.stringify(member));
          });

          fd.set("leads", JSON.stringify(project.leads));

          fd.set("save_for_future", project.save_for_future ? 1 : 0);

          api.create_project(fd).then((data) => {
            const errors = data.errors ? Object.values(data.errors) : [];
            if (errors.length || data.exception) {
              const message = Object.values(errors).flat(1).join(" ") || data.message;
              setPopup({
                ...popup,
                server_error: {
                  visible: true,
                  message,
                },
              });
              return;
            }
            return;
          });
        });
      resolve("done!");
    });

    await promise.then(() => {
      message.destroy("analyzing");
      push("/active-projects");

      message.open({
        type: 'success',
        content: (
          <span dangerouslySetInnerHTML={{ __html: `Your document is ready! <a style="color: #4096ff;" href="/active-projects">Click here</a> to view.` }} />
        ),
        duration: 1000 * 1000,
      });
    });
  };

  useEffect(() => {
    const segments = location.pathname.split("/");
    segments.pop();
    const step = segments.pop();

    if (["new-project"].includes(step)) {
      setActiveStep("");
    }
    if (["step-3", "step-4"].includes(step)) {
      setActiveStep(step);
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="lg:pl-[270px] pl-0 pt-[150px] pr-[15px] relative pb-[100px]">
        <Card className={`${final ? 'w-[100%]' : 'max-w-[800px]'} mx-auto`}>
          <Stepper steps={steps} active={activeStep} onChange={onChangeActiveStep} />

          <NewProjectContext.Provider value={{ project, setProject, handleNext }}>
            {children}
          </NewProjectContext.Provider>
        </Card>
        <div className="fixed bottom-0 z-[2] left-0 right-0 border-t p-[15px] bg-[#fff] lg:pl-[270px] pl-0 ">
          <div className={`mx-auto max-w-[800px] flex items-center justify-between`}>
            <Button
              {...{ disabled: !isCanPrev() }}
              onClick={handlePrev}
              icon={searchsvg}
              label="Previous"
              className="border border-[#1860CC] !text-[#1860CC] font-bold !w-auto text-[14px] px-[20px]"
            />
            <Button
              {...{ disabled: !isCanNext() }}
              onClick={handleNext}
              label="Save and Continue"
              className="bg-[#1860CC] !text-white font-bold !w-auto text-[14px] px-[20px]"
            />
          </div>
        </div>

        <ServerError
          open={popup.server_error.visible}
          title="Error"
          message={popup.server_error.message}
          onClose={() => {
            setPopup({ ...popup, server_error: { visible: false } });
          }}
        />

        <ServerSuccess
          open={popup.server_success.visible}
          title={popup.server_success.title}
          message={popup.server_success.message}
          onClose={() => {
            setPopup({ ...popup, server_success: { visible: false } });
          }}
        />
      </div>
    </DashboardLayout>
  );
}
